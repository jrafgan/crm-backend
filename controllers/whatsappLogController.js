const WhatsAppLog = require('../models/WhatsAppLog');

exports.getLogs = async (req, res) => {
    try {
        const logs = await WhatsAppLog.find().sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении логов', details: error.message });
    }
};

exports.getLogsByPhone = async (req, res) => {
    try {
        const phone = req.params.phone;
        const logs = await WhatsAppLog.find({ phone }).sort({ createdAt: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении логов по номеру', details: error.message });
    }
};
