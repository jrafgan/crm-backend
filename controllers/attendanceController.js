const Attendance = require('../models/Attendance');

exports.markAttendance = async (req, res) => {
    try {
        const { studentId, date, status, note } = req.body;
        const teacherId = req.user.id;

        const record = await Attendance.findOneAndUpdate(
            { studentId, date },
            { studentId, teacherId, date, status, note },
            { upsert: true, new: true }
        );

        res.status(200).json(record);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getAttendance = async (req, res) => {
    try {
        const { studentId, teacherId, from, to } = req.query;
        const filter = {};

        if (studentId) filter.studentId = studentId;
        if (teacherId) filter.teacherId = teacherId;
        if (from || to) {
            filter.date = {};
            if (from) filter.date.$gte = new Date(from);
            if (to) filter.date.$lte = new Date(to);
        }

        const records = await Attendance.find(filter)
            .populate('studentId', 'name group')
            .populate('teacherId', 'fullName');

        res.json(records);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
