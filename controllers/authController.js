const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = user => jwt.sign(
    { id: user._id, role: user.role, fullName: user.fullName },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
);

exports.register = async (req, res) => {
    try {
        const { fullName, phone, password, role } = req.body;
        const existing = await User.findOne({ phone });
        if (existing) return res.status(400).json({ message: 'Пользователь уже существует' });
        const hashed = await bcrypt.hash(password, 10);
        const user = await User.create({ fullName, phone, password: hashed, role, createdBy: req.user?.id });
        const token = generateToken(user);
        const userData = user.toObject(); delete userData.password;
        res.status(201).json({ token, user: userData });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const user = await User.findOne({ phone });
        if (!user) return res.status(401).json({ message: 'Неверный номер или пароль' });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(401).json({ message: 'Неверный номер или пароль' });
        const token = generateToken(user);
        const userData = user.toObject(); delete userData.password;
        res.json({ token, user: userData });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
