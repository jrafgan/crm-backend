const jwt = require('jsonwebtoken');

// Проверка JWT токена
const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'Нет токена' });

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (e) {
        res.status(403).json({ message: 'Недействительный токен' });
    }
};

// Проверка роли (admin, teacher)
const roleMiddleware = (allowedRoles = []) => (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
        return res.status(403).json({ message: 'Доступ запрещён' });
    }
    next();
};

module.exports = {
    authMiddleware,
    roleMiddleware
};
