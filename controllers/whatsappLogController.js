const WhatsAppLog = require('../models/WhatsAppLog');

// GET /whatsapp-logs?limit=100&status=sent
exports.getLogs = async (req, res) => {
    try {
        const { limit = 100, status } = req.query;

        const filter = {};
        if (status) filter.status = status;

        const logs = await WhatsAppLog.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении логов', details: error.message });
    }
};

// GET /whatsapp-logs/:phone?limit=50
exports.getLogsByPhone = async (req, res) => {
    try {
        const phone = req.params.phone;
        const limit = parseInt(req.query.limit || 50);

        const logs = await WhatsAppLog.find({ phone })
            .sort({ createdAt: -1 })
            .limit(limit);

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении логов по номеру', details: error.message });
    }
};
