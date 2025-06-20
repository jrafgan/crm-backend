const Schedule = require('../models/Schedule');
const Student = require('../models/Student');

// ✅ Создание расписания
exports.createSchedule = async (req, res) => {
    try {
        const { teacherId, weekStart, slots } = req.body;

        if (!slots || !Array.isArray(slots) || slots.length === 0) {
            return res.status(400).json({ error: 'Слоты обязательны' });
        }

        const schedule = new Schedule({ teacherId, weekStart, slots });
        await schedule.save();

        res.status(201).json(schedule);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка создания расписания', details: err.message });
    }
};

// ✅ Получение всех расписаний (без фильтра)
exports.getAllSchedules = async (req, res) => {
    try {
        const schedules = await Schedule.find()
            .populate('teacherId', 'fullName')
            .populate('slots.studentId', 'fullName packageType');

        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении всех расписаний', details: err.message });
    }
};


// ✅ Получение расписаний с фильтрами
exports.getSchedules = async (req, res) => {
    try {
        const filter = {};
        const { teacherId, weekStart } = req.query;

        if (teacherId) filter.teacherId = teacherId;
        if (weekStart) filter.weekStart = new Date(weekStart);

        const schedules = await Schedule.find(filter)
            .populate('teacherId', 'fullName')
            .populate('slots.studentId', 'fullName packageType');

        res.json(schedules);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения расписаний', details: err.message });
    }
};

// ✅ Получение одного расписания
exports.getScheduleById = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id)
            .populate('teacherId', 'fullName')
            .populate('slots.studentId', 'fullName packageType');

        if (!schedule) return res.status(404).json({ message: 'Расписание не найдено' });

        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка получения расписания', details: err.message });
    }
};

// ✅ Обновление расписания
exports.updateSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Расписание не найдено' });

        const { weekStart, slots } = req.body;

        if (weekStart) schedule.weekStart = new Date(weekStart);
        if (slots && Array.isArray(slots)) schedule.slots = slots;

        await schedule.save();
        res.json(schedule);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка обновления расписания', details: err.message });
    }
};

// ✅ Удаление расписания
exports.deleteSchedule = async (req, res) => {
    try {
        const schedule = await Schedule.findById(req.params.id);
        if (!schedule) return res.status(404).json({ message: 'Расписание не найдено' });

        await schedule.remove();
        res.json({ message: 'Расписание удалено' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка удаления расписания', details: err.message });
    }
};

// 📌 Обновить слот по индексу
exports.updateSlot = async (req, res) => {
    try {
        const { scheduleId, slotIndex } = req.params;
        const updateData = req.body;

        const schedule = await Schedule.findById(scheduleId);
        if (!schedule || !schedule.slots[slotIndex]) {
            return res.status(404).json({ error: 'Слот не найден' });
        }

        // Обновляем слот
        Object.assign(schedule.slots[slotIndex], updateData);
        await schedule.save();

        res.json({ message: 'Слот обновлён', slot: schedule.slots[slotIndex] });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при обновлении слота', details: err.message });
    }
};

// ➕ Добавить слот в расписание
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


// 🗑️ Удалить слот по индексу
exports.deleteSlot = async (req, res) => {
    try {
        const { scheduleId, slotIndex } = req.params;

        const schedule = await Schedule.findById(scheduleId);
        if (!schedule || !schedule.slots[slotIndex]) {
            return res.status(404).json({ error: 'Слот не найден' });
        }

        schedule.slots.splice(slotIndex, 1); // Удаление
        await schedule.save();

        res.json({ message: 'Слот удалён' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при удалении слота', details: err.message });
    }
};

exports.copyScheduleToNextWeek = async (req, res) => {
    try {
        const sourceSchedule = await Schedule.findById(req.params.id);
        if (!sourceSchedule) {
            return res.status(404).json({ error: 'Расписание не найдено' });
        }

        // Вычисляем следующую неделю
        const newWeekStart = new Date(sourceSchedule.weekStart);
        newWeekStart.setDate(newWeekStart.getDate() + 7);

        // Проверяем, не существует ли уже расписание на ту неделю
        const existing = await Schedule.findOne({
            teacherId: sourceSchedule.teacherId,
            weekStart: newWeekStart
        });
        if (existing) {
            return res.status(400).json({ error: 'Расписание на следующую неделю уже существует' });
        }

        // Копируем слоты
        const newSchedule = new Schedule({
            teacherId: sourceSchedule.teacherId,
            weekStart: newWeekStart,
            slots: sourceSchedule.slots.map(slot => ({ ...slot.toObject() })) // глубокая копия
        });

        await newSchedule.save();

        res.status(201).json({ message: 'Расписание скопировано', schedule: newSchedule });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при копировании расписания', details: err.message });
    }
};

