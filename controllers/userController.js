const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
    try {
        const { role, isActive } = req.query;

        const filter = {};
        if (role)     filter.role = role;
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        const users = await User.find(filter);
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.createUser = async (req, res) => {
    try {
        const { fullName, phone, password, role } = req.body;
        const creatorRole = req.user.role;
        if (creatorRole === 'teacher' && role !== 'student') {
            return res.status(403).json({ message: 'Преподаватель может создавать только учеников' });
        }
        if (await User.findOne({ phone })) {
            return res.status(400).json({ message: 'Пользователь с таким номером уже существует' });
        }
        const hashed = await bcrypt.hash(password, 10);
        const newUser = await User.create({ fullName, phone, password: hashed, role, createdBy: req.user.id });
        const userData = newUser.toObject(); delete userData.password;
        res.status(201).json(userData);
    } catch (err) {
        res.status(500).json({ message: 'Не удалось создать пользователя' });
    }
};


exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};
        const users = await User.find(filter).select('-password').sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Не удалось получить пользователей' });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении пользователя' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true }).select('-password');
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
        res.json(user);
    } catch (err) {
        res.status(400).json({ message: 'Ошибка при обновлении пользователя' });
    }
};

exports.deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'Пользователь не найден' });
        res.json({ message: 'Пользователь удалён' });
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при удалении пользователя' });
    }
};

