const Student = require('../models/Student');
const User = require('../models/User');

exports.filterRecipients = async (filters) => {
    let recipients = [];

    if (!filters || !filters.role) throw new Error('Не указана роль для фильтрации');

    if (filters.role === 'student') {
        const query = {};
        if (filters.status) query.status = filters.status;
        if (filters.learningStatus) query.learningStatus = filters.learningStatus;
        if (filters.packageType) query.packageType = filters.packageType;
        if (filters.hasPaid !== undefined) query.hasPaid = filters.hasPaid;

        recipients = await Student.find(query).select('phone fullName');
    }

    else if (filters.role === 'teacher') {
        const query = { role: 'teacher' };
        if (filters.isActive !== undefined) query.isActive = filters.isActive;

        recipients = await User.find(query).select('phone fullName');
    }

    else if (filters.role === 'admin') {
        recipients = await User.find({ role: 'admin' }).select('phone fullName');
    }

    return recipients.filter(r => r.phone); // Исключить без номера
};
