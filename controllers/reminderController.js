const ReminderTemplate = require('../models/Reminder');

exports.updateReminderMessage = async (req, res) => {
    const { key, message } = req.body;

    if (!key || !message) {
        return res.status(400).json({ error: 'key и message обязательны' });
    }

    const updated = await ReminderTemplate.findOneAndUpdate(
        { key },
        { message },
        { upsert: true, new: true }
    );

    res.json({ message: 'Шаблон обновлён', data: updated });
};

exports.getReminderMessage = async (req, res) => {
    const { key } = req.params;
    const template = await ReminderTemplate.findOne({ key });

    if (!template) {
        return res.status(404).json({ error: 'Шаблон не найден' });
    }

    res.json(template);
};
