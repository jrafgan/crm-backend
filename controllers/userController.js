const bcrypt = require('bcryptjs');
const User = require('../models/User');

exports.getAllUsers = async (req, res) => {
    try {
        const { role } = req.query;
        const filter = role ? { role } : {};
        const users = await User.find(filter)
            .select('-password')
            .sort({ createdAt: -1 });
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Не удалось получить пользователей' });
    }
};

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

const User = require('../models/User');

// ✅ Создание админа
exports.createAdmin = async (req, res) => {
    try {
        const data = { ...req.body, role: 'admin' };
        const user = await User.create(data);
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ Получение всех админов с фильтрами
exports.getAdmins = async (req, res) => {
    try {
        const { periodStart, periodEnd } = req.query;
        const filter = { role: 'admin' };

        if (periodStart || periodEnd) {
            filter.createdAt = {};
            if (periodStart) filter.createdAt.$gte = new Date(periodStart);
            if (periodEnd)   filter.createdAt.$lte = new Date(periodEnd);
        }

        const admins = await User.find(filter);
        res.json(admins);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// ✅ Обновление админа
exports.updateAdmin = async (req, res) => {
    try {
        const admin = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!admin) return res.status(404).json({ message: 'Админ не найден' });
        res.json(admin);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// ✅ Удаление админа
exports.deleteAdmin = async (req, res) => {
    try {
        const admin = await User.findByIdAndDelete(req.params.id);
        if (!admin) return res.status(404).json({ message: 'Админ не найден' });
        res.json({ message: 'Админ удалён' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

