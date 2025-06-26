const Attendance = require('../models/Attendance');

// ✅ Добавление/обновление посещаемости по слоту
exports.markAttendance = async (req, res) => {
    try {
        const { scheduleId, slotIndex } = req.params;
        const { studentId, date, status, comment, lessonType } = req.body;

        if (!studentId || !date || !status) {
            return res.status(400).json({ error: 'studentId, date и status обязательны' });
        }

        const attendance = await Attendance.findOneAndUpdate(
            { student: studentId, date: new Date(date) },
            {
                student: studentId,
                teacher: req.user.id,
                date: new Date(date),
                status,
                comment,
                lessonType,
                scheduleId,
                slotIndex
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.json({ message: 'Посещение сохранено', attendance });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка отметки посещения', details: err.message });
    }
};

// ✅ Получение отчета по посещаемости
exports.getAttendanceReport = async (req, res) => {
    try {
        const { studentId, teacherId, dateStart, dateEnd, status } = req.query;

        const filter = {};
        if (studentId) filter.student = studentId;
        if (teacherId) filter.teacher = teacherId;
        if (status) filter.status = status;

        if (dateStart || dateEnd) {
            filter.date = {};
            if (dateStart) filter.date.$gte = new Date(dateStart);
            if (dateEnd) filter.date.$lte = new Date(dateEnd);
        }

        const records = await Attendance.find(filter)
            .populate('student', 'fullName packageType')
            .populate('teacher', 'fullName');

        res.json(records);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения отчета', details: err.message });
    }
};