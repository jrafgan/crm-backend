const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const { toAllTeachers, ...taskData } = req.body;

        if (toAllTeachers) {
            const teachers = await User.find({ role: 'teacher' });
            const tasks = await Promise.all(
                teachers.map(t =>
                    Task.create({
                        ...taskData,
                        toAllTeachers: true,
                        assignedTo: t._id,
                        createdBy: req.user.id
                    })
                )
            );
            return res.status(201).json({ message: `Создано задач: ${tasks.length}` });
        }

        const task = await Task.create({
            ...taskData,
            assignedTo: req.body.assignedTo,
            createdBy: req.user.id
        });

        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};


exports.getTasks = async (req, res) => {
    try {
        const filter = req.user.role === 'teacher'
            ? { assignedTo: req.user.id }
            : {};

        const tasks = await Task.find(filter)
            .populate('assignedTo', 'fullName')
            .populate('createdBy', 'fullName');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getTaskById = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id)
            .populate('assignedTo', 'fullName')
            .populate('createdBy', 'fullName');
        if (!task) return res.status(404).json({ message: 'Задача не найдена' });

        // Только учитель, которому назначена задача, или админ могут видеть
        if (req.user.role === 'teacher' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }

        res.json(task);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateTask = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Задача не найдена' });

        Object.assign(task, req.body);
        await task.save();

        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteTask = async (req, res) => {
    try {
        const task = await Task.findByIdAndDelete(req.params.id);
        if (!task) return res.status(404).json({ message: 'Задача не найдена' });

        res.json({ message: 'Задача удалена' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markComplete = async (req, res) => {
    try {
        const task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ message: 'Задача не найдена' });

        // Только назначенный учитель может отметить как выполненную
        if (req.user.role === 'teacher' && task.assignedTo.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }

        task.completed = true;
        task.status = 'Выполнено';
        await task.save();

        res.json({ message: 'Задача выполнена', task });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
