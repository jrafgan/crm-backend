const Schedule = require('../models/Schedule');

exports.createSchedule = async (req, res) => {
    try {
        const { teacherId, weekStart, slots } = req.body;
        if (!slots?.length) return res.status(400).json({ error: 'Слоты обязательны' });
        const schedule = new Schedule({ teacherId, weekStart, slots });
        await schedule.save();
        res.status(201).json(schedule);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка создания расписания', details: err.message });
    }
};

exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate('teacherId', 'fullName')
            .populate('slots.studentIds', 'fullName packageType');
        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении всех расписаний', details: err.message });
    }
};

exports.getSchedules = async (req, res) => {
    try {
        const { teacherId, weekStart } = req.query;
        const filter = {};
        if (teacherId) filter.teacherId = teacherId;
        if (weekStart) filter.weekStart = new Date(weekStart);

        const schedules = await Schedule.find(filter)
            .populate('teacherId', 'fullName')
            .populate('slots.studentIds', 'fullName packageType');

        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения расписаний', details: err.message });
    }
};

exports.getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate('teacherId', 'fullName')
            .populate('slots.studentIds', 'fullName packageType');

        if (!schedule) return res.status(404).json({ message: 'Расписание не найдено' });
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения расписания', details: err.message });
    }
};

exports.updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Расписание не найдено' });

        const { weekStart, slots } = req.body;
        if (weekStart && !isNaN(new Date(weekStart))) schedule.weekStart = new Date(weekStart);
        if (Array.isArray(slots)) schedule.slots = slots;

        await schedule.save();
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка обновления расписания', details: err.message });
    }
};

exports.copyScheduleToNextWeek = async (req, res) => {
    try {
        const sourceSchedule = await Schedule.findById(req.params.id);
        if (!sourceSchedule) return res.status(404).json({ error: 'Расписание не найдено' });

        const newWeekStart = new Date(sourceSchedule.weekStart);
        newWeekStart.setDate(newWeekStart.getDate() + 7);

        const existing = await Schedule.findOne({ teacherId: sourceSchedule.teacherId, weekStart: newWeekStart });
        if (existing) return res.status(400).json({ error: 'Расписание на следующую неделю уже существует' });

        const newSchedule = new Schedule({
            teacherId: sourceSchedule.teacherId,
            weekStart: newWeekStart,
            slots: sourceSchedule.slots.map(slot => {
                const cleanSlot = { ...slot.toObject() };
                delete cleanSlot._id;
                return cleanSlot;
            })
        });

        await newSchedule.save();
        res.status(201).json({ message: 'Расписание скопировано', schedule: newSchedule });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при копировании расписания', details: err.message });
    }
};

exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Расписание не найдено' });
        await Schedule.findByIdAndDelete(req.params.id);
        res.json({ message: 'Расписание удалено' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления расписания', details: err.message });
    }
};

exports.updateSlot = async (req, res) => {
    try {
        const { scheduleId, slotIndex } = req.params;
        const updateData = req.body;
        const schedule = await Schedule.findById(scheduleId);

        if (!schedule || !schedule.slots[slotIndex]) return res.status(404).json({ error: 'Слот не найден' });

        Object.assign(schedule.slots[slotIndex], updateData);
        await schedule.save();

        res.json({ message: 'Слот обновлён', slot: schedule.slots[slotIndex] });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при обновлении слота', details: err.message });
    }
};

exports.addSlot = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) return res.status(404).json({ error: 'Расписание не найдено' });

        schedule.slots.push(req.body);
        await schedule.save();

        res.json({ message: 'Слот добавлен', slots: schedule.slots });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при добавлении слота', details: err.message });
    }
};

exports.assignStudentToSlot = async (req, res) => {
    try {
        const { id, index } = req.params;
        const { studentId } = req.body;
        const schedule = await Schedule.findById(id);

        if (!schedule || !schedule.slots[index]) return res.status(404).json({ error: 'Слот не найден' });

        schedule.slots[index].studentIds.push(studentId);
        await schedule.save();

        res.json({ message: 'Ученик назначен в слот', slot: schedule.slots[index] });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при назначении ученика', details: err.message });
    }
};

exports.deleteSlot = async (req, res) => {
    try {
        const { scheduleId, slotIndex } = req.params;
        const schedule = await Schedule.findById(scheduleId);

        if (!schedule || !schedule.slots[slotIndex]) return res.status(404).json({ error: 'Слот не найден' });

        schedule.slots.splice(slotIndex, 1);
        await schedule.save();

        res.json({ message: 'Слот удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при удалении слота', details: err.message });
    }
};