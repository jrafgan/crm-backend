const Task = require('../models/Task');

exports.createTask = async (req, res) => {
    try {
        const task = await Task.create({ ...req.body, assignedTo: req.user.id });
        res.status(201).json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getTasks = async (req, res) => {
    try {
        const filter = req.user.role === 'teacher' ? { assignedTo: req.user.id } : {};
        const tasks = await Task.find(filter).populate('assignedTo', 'fullName');
        res.json(tasks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.markComplete = async (req, res) => {
    try {
        const task = await Task.findByIdAndUpdate(req.params.id, { completed: true, status: 'Выполнено' }, { new: true });
        if (!task) return res.status(404).json({ message: 'Задача не найдена' });
        res.json(task);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
