// controllers/whatsappController.js
const { sendMessage, getClient, normalizeJid, getQR } = require('../services/whatsappClient');
const WhatsAppLog = require('../models/WhatsAppLog');
const { filterRecipients } = require('../services/whatsappFilterService');
const pLimit = require('p-limit').default;
const delay = ms => new Promise(res => setTimeout(res, ms));

const CONCURRENCY_LIMIT = 5;
const MESSAGE_DELAY_MS = 1000;

exports.sendMessage = async (req, res) => {
    const { phone, message } = req.body;
    if (!phone || !message) {
        return res.status(400).json({ error: 'Номер и текст обязательны' });
    }

    try {
        await sendMessage(phone, message);
        await WhatsAppLog.create({ phone, message, status: 'sent' });
        res.json({ message: 'Сообщение отправлено' });
    } catch (err) {
        await WhatsAppLog.create({ phone, message, status: 'failed', error: err.message });
        res.status(500).json({ error: 'Ошибка отправки', details: err.message });
    }
};

exports.sendBulkMessages = async (req, res) => {
    const { filters, message } = req.body;
    if (!message || typeof message !== 'string') {
        return res.status(400).json({ error: 'Текст сообщения обязателен' });
    }

    try {
        const recipients = await filterRecipients(filters);
        if (!recipients.length) {
            return res.status(404).json({ error: 'Не найдено ни одного получателя по заданным фильтрам' });
        }

        const results = [];
        for (let i = 0; i < recipients.length; i++) {
            const recipient = recipients[i];
            const phone = recipient.phone;
            try {
                await whatsappClient.sendMessage(phone, message);
                await WhatsAppLog.create({ phone, message, status: 'sent' });
                results.push({ phone, status: 'sent' });
            } catch (err) {
                await WhatsAppLog.create({ phone, message, status: 'failed', error: err.message });
                results.push({ phone, status: 'failed', error: err.message });
            }
            await delay(MESSAGE_DELAY_MS);
        }

        const sentCount = results.filter(r => r.status === 'sent').length;
        res.json({
            total: results.length,
            sent: sentCount,
            failed: results.length - sentCount,
            details: results
        });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при отправке сообщений', details: err.message });
    }
};

