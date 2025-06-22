const WhatsAppLog = require('../models/WhatsAppLog');

// GET /whatsapp-logs?limit=100&status=sent&startDate=2024-01-01&endDate=2024-01-31&text=hello
exports.getLogs = async (req, res) => {
    try {
        const { limit = 100, status, startDate, endDate, text } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        if (text) {
            filter.message = { $regex: text, $options: 'i' };
        }

        const logs = await WhatsAppLog.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении логов', details: error.message });
    }
};

// GET /whatsapp-logs/:phone?limit=50&startDate=2024-01-01&endDate=2024-01-31&text=error
exports.getLogsByPhone = async (req, res) => {
    try {
        const phone = req.params.phone;
        const { limit = 50, startDate, endDate, text } = req.query;

        const filter = { phone };
        if (startDate || endDate) {
            filter.createdAt = {};
            if (startDate) filter.createdAt.$gte = new Date(startDate);
            if (endDate) filter.createdAt.$lte = new Date(endDate);
        }
        if (text) {
            filter.message = { $regex: text, $options: 'i' };
        }

        const logs = await WhatsAppLog.find(filter)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении логов по номеру', details: error.message });
    }
};
