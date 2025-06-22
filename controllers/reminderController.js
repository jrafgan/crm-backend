const ReminderTemplate = require('../models/Reminder');

exports.updateReminderMessage = async (req, res) => {
    const { key, message } = req.body;

    if (!key || !message) {
        return res.status(400).json({ error: 'key и message обязательны' });
    }

    try {
        const updated = await ReminderTemplate.findOneAndUpdate(
            { key },
            { message },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ message: 'Шаблон сохранён', data: updated });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка обновления шаблона', details: error.message });
    }
};

exports.getReminderMessage = async (req, res) => {
    const { key } = req.params;

    try {
        const template = await ReminderTemplate.findOne({ key });

        if (!template) {
            return res.status(404).json({ error: 'Шаблон не найден' });
        }

        res.json(template);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка получения шаблона', details: error.message });
    }
};
