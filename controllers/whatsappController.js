const whatsappClient = require('../services/whatsappClient');
const WhatsAppLog = require('../models/WhatsAppLog');
const { filterRecipients } = require('../services/whatsappFilterService');

exports.sendMessage = async (req, res) => {
    const { phone, message } = req.body;

    if (!phone || !message) {
        return res.status(400).json({ error: 'Номер и текст обязательны' });
    }

    try {
        await whatsappClient.sendMessage(phone, message);

        await WhatsAppLog.create({ phone, message, status: 'sent', createdAt: new Date() });

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
        const results = [];

        for (const recipient of recipients) {
            const phone = recipient.phone;

            try {
                await whatsappClient.sendMessage(phone, message);
                await WhatsAppLog.create({ phone, message, status: 'sent' });
                results.push({ phone, status: 'sent' });
            } catch (err) {
                await WhatsAppLog.create({ phone, message, status: 'failed', error: err.message });
                results.push({ phone, status: 'failed', error: err.message });
            }
        }

        res.json({ sent: results.length, success: results.filter(r => r.status === 'sent').length, details: results });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка фильтрации или отправки', details: err.message });
    }
};
