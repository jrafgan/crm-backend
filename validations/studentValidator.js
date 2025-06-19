const { body, validationResult } = require('express-validator');

const validateStudent = [
    body('name').isString().notEmpty().withMessage('name обязателен'),
    body('phone').isMobilePhone('any').withMessage('phone некорректен'),
    body('group').isString().optional(),
    body('level')
        .isIn(['Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced'])
        .withMessage('Неверный уровень'),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
        next();
    }
];

module.exports = validateStudent;
