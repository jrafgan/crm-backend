const Student = require('../models/Student');
const User = require('../models/User');
const { createObjectCsvWriter } = require('csv-writer');
const { exportToExcel } = require('../utils/excelExport');
const path = require('path');
const fs = require('fs');

const exportToCsv = async (res, data, headers, filename) => {
    const filePath = path.join(__dirname, `../exports/${filename}`);
    const writer = createObjectCsvWriter({
        path: filePath,
        header: headers,
    });

    await writer.writeRecords(data);
    res.download(filePath, filename, () => fs.unlinkSync(filePath));
};

exports.exportStudents = async (req, res) => {
    try {
        const { status, paymentStatus, from, to, teacherId } = req.query;

        const filter = {};
        if (status) filter.status = status;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (teacherId) filter.teacherId = teacherId;

        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }

        const students = await Student.find(filter)
            .populate('teacherId', 'fullName phone')
            .lean();

        const excelBuffer = await exportToExcel(students, 'students_export');

        res.setHeader('Content-Disposition', 'attachment; filename=students.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка экспорта студентов' });
    }
};

exports.exportUsers = async (req, res) => {
    try {
        const { role, from, to } = req.query;

        const filter = {};
        if (role) filter.role = role;
        if (from || to) {
            filter.createdAt = {};
            if (from) filter.createdAt.$gte = new Date(from);
            if (to) filter.createdAt.$lte = new Date(to);
        }

        const users = await User.find(filter).lean();

        const excelBuffer = await exportToExcel(users, `users_${role || 'all'}`);

        res.setHeader('Content-Disposition', 'attachment; filename=users.xlsx');
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.send(excelBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Ошибка экспорта пользователей' });
    }
};


