const Schedule = require('../models/Schedule');

exports.createSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.create({ ...req.body, teacherId: req.user.id });
        res.status(201).json(schedule);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getSchedule = async (req, res) => {
    try {
        const filter = {};
        if (req.user.role === 'teacher') {
            filter.teacherId = req.user.id;
        } else if (req.query.teacherId) {
            filter.teacherId = req.query.teacherId;
        }

        if (req.query.date) {
            filter.date = req.query.date;
        }

        const schedule = await Schedule.find(filter).populate('teacherId', 'fullName');
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
