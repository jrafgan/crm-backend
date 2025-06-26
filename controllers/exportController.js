const ExcelJS = require('exceljs');
const Student = require('../models/Student');
const User = require('../models/User');
const Payment = require('../models/Payment');

const sendExcelFile = async (res, rows, columns, filename = 'export.xlsx') => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Данные');

    worksheet.columns = columns;
    worksheet.addRows(rows);

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

    await workbook.xlsx.write(res);
    res.end();
};

// ✅ Экспорт учеников
exports.exportStudents = async (req, res) => {
    try {
        const {
            packageType,
            learningStatus,
            paymentStatus,
            teacherId,
            periodStart,
            periodEnd
        } = req.query;

        const filter = {};

        if (packageType)     filter.packageType     = packageType;
        if (learningStatus)  filter.learningStatus  = learningStatus;
        if (paymentStatus)   filter.paymentStatus   = paymentStatus;
        if (teacherId)       filter.teacherId       = teacherId;

        if (periodStart || periodEnd) {
            filter.createdAt = {};
            if (periodStart) filter.createdAt.$gte = new Date(periodStart);
            if (periodEnd)   filter.createdAt.$lte = new Date(periodEnd);
        }

        const students = await Student.find(filter).populate('teacherId', 'fullName');

        const rows = students.map(s => ({
            "ФИО": s.fullName,
            "Телефон": s.phone,
            "Группа": s.group,
            "Уровень": s.level,
            "Пакет": s.packageType,
            "Статус обучения": s.learningStatus,
            "Оплата": s.paymentStatus,
            "Преподаватель": s.teacherId ? s.teacherId.fullName : '—',
            "Дата": s.createdAt.toISOString().split('T')[0]
        }));

        const columns = [
            { header: 'ФИО', key: 'ФИО', width: 30 },
            { header: 'Телефон', key: 'Телефон', width: 15 },
            { header: 'Группа', key: 'Группа', width: 15 },
            { header: 'Уровень', key: 'Уровень', width: 15 },
            { header: 'Пакет', key: 'Пакет', width: 20 },
            { header: 'Статус обучения', key: 'Статус обучения', width: 20 },
            { header: 'Оплата', key: 'Оплата', width: 20 },
            { header: 'Преподаватель', key: 'Преподаватель', width: 25 },
            { header: 'Дата регистрации', key: 'Дата', width: 15 }
        ];
        await sendExcelFile(res, rows, columns, 'students.xlsx');
    } catch (err) {
        res.status(500).json({ error: 'Ошибка экспорта учеников', details: err.message });
    }
};


// ✅ Экспорт учителей
exports.exportTeachers = async (req, res) => {
    try {
        const { periodStart, periodEnd, isActive } = req.query;

        const filter = { role: 'teacher' };
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        if (periodStart || periodEnd) {
            filter.createdAt = {};
            if (periodStart) filter.createdAt.$gte = new Date(periodStart);
            if (periodEnd)   filter.createdAt.$lte = new Date(periodEnd);
        }

        const teachers = await User.find(filter);

        const rows = teachers.map(a => {
            // если нет createdAt, берём время из ObjectId
            const createdAt = a.createdAt
                ? new Date(a.createdAt)
                : a._id.getTimestamp();
            return {
                'ФИО': a.fullName,
                'Телефон': a.phone,
                'Активность': a.isActive ? '✅ Активен' : '⛔ Неактивен',
                'Дата': createdAt.toISOString().split('T')[0]
            };
        });

        const columns = [
            { header: 'ФИО', key: 'ФИО', width: 30 },
            { header: 'Телефон', key: 'Телефон', width: 15 },
            { header: 'Активность', key: 'Активность', width: 15 },
            { header: 'Дата регистрации', key: 'Дата', width: 20 }
        ];

        await sendExcelFile(res, rows, columns, 'teachers.xlsx');
    } catch (err) {
        res.status(500).json({ error: 'Ошибка экспорта учителей', details: err.message });
    }
};


// ✅ Экспорт админов
exports.exportAdmins = async (req, res) => {
    try {
        const { periodStart, periodEnd, isActive } = req.query;

        const filter = { role: 'admin' };
        if (isActive !== undefined) filter.isActive = isActive === 'true';

        if (periodStart || periodEnd) {
            filter.createdAt = {};
            if (periodStart) filter.createdAt.$gte = new Date(periodStart);
            if (periodEnd)   filter.createdAt.$lte = new Date(periodEnd);
        }

        const admins = await User.find(filter);

        const rows = admins.map(a => {
            // если нет createdAt, берём время из ObjectId
            const createdAt = a.createdAt
                ? new Date(a.createdAt)
                : a._id.getTimestamp();
            return {
                'ФИО': a.fullName,
                'Телефон': a.phone,
                'Активность': a.isActive ? '✅ Активен' : '⛔ Неактивен',
                'Дата': createdAt.toISOString().split('T')[0]
            };
        });


        const columns = [
            { header: 'ФИО', key: 'ФИО', width: 30 },
            { header: 'Телефон', key: 'Телефон', width: 15 },
            { header: 'Активность', key: 'Активность', width: 15 },
            { header: 'Дата регистрации', key: 'Дата', width: 20 }
        ];

        await sendExcelFile(res, rows, columns, 'admins.xlsx');
    } catch (err) {
        res.status(500).json({ error: 'Ошибка экспорта админов', details: err.message });
    }
};

// Экспорт списка платежей в Excel
exports.exportPayments = async (req, res) => {
    try {
        const payments = await Payment.find()
            .populate('studentId', 'fullName')
            .lean();

        const workbook = new ExcelJS.Workbook();
        const sheet = workbook.addWorksheet('Payments');

        sheet.columns = [
            { header: 'ID', key: 'id', width: 24 },
            { header: 'Студент', key: 'student', width: 30 },
            { header: 'Сумма', key: 'amount', width: 15 },
            { header: 'Метод', key: 'method', width: 15 },
            { header: 'Тип', key: 'paymentType', width: 15 },
            { header: 'Дата', key: 'date', width: 20 }
        ];

        payments.forEach(p => {
            sheet.addRow({
                id: p._id.toString(),
                student: p.studentId?.fullName || '',
                amount: p.amount,
                method: p.method,
                paymentType: p.paymentType,
                date: p.date.toISOString()
            });
        });

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=payments.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
