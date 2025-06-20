const path = require('path');
const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
    try {
        const data = {
            fullName:  req.body.fullName,
            phone:     req.body.phone,
            group:     req.body.group,
            level:     req.body.level,
            packageType: req.body.packageType,
            learningStatus: req.body.learningStatus || 'обучается',
            status:    req.body.status || 'active',
            hasPaid:   req.body.hasPaid || false,
            teacherId: req.user.role === 'teacher' ? req.user.id : req.body.teacherId,
            createdBy: req.user.id
        };

        const student = await Student.create(data);
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const {
            group,
            status,
            paid,
            teacherId,
            periodStart,
            periodEnd,
            learningStatus,
            packageType,
            paymentStatus
        } = req.query;

        const filter = {};

        if (group)         filter.group         = group;
        if (status)        filter.status        = status;
        if (paid !== undefined) filter.hasPaid  = paid === 'true';
        if (teacherId)     filter.teacherId     = teacherId;
        if (learningStatus) filter.learningStatus = learningStatus;
        if (packageType)   filter.packageType   = packageType;
        if (paymentStatus) filter.paymentStatus = paymentStatus;

        if (periodStart || periodEnd) {
            filter.createdAt = {};
            if (periodStart) filter.createdAt.$gte = new Date(periodStart);
            if (periodEnd)   filter.createdAt.$lte = new Date(periodEnd);
        }

        // Учитель видит только своих
        if (req.user.role === 'teacher') {
            filter.teacherId = req.user.id;
        }

        const students = await Student.find(filter).populate('teacherId', 'fullName');
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('teacherId', 'fullName');
        if (!student) return res.status(404).json({ message: 'Студент не найден' });

        if (req.user.role === 'teacher' && student.teacherId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }

        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.updateStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Студент не найден' });

        if (req.user.role === 'teacher' && student.teacherId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }

        Object.assign(student, req.body);
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteStudent = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Студент не найден' });

        if (req.user.role === 'teacher' && student.teacherId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }

        await student.remove();
        res.json({ message: 'Студент удалён' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.uploadReceipt = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ message: 'Ученик не найден' });

        if (!req.file || !req.file.path)
            return res.status(400).json({ message: 'Файл не загружен' });

        // Добавляем путь к чеку в список чеков
        if (!student.paymentReceipts) {
            student.paymentReceipts = [];
        }
        student.paymentReceipts.push(req.file.path);

        // ❗ НЕ меняем статус оплаты автоматически
        await student.save();

        res.json({ message: 'Чек успешно загружен', file: req.file.path });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};


exports.getReceipts = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student || !student.paymentReceipts || !student.paymentReceipts.length)
            return res.status(404).json({ message: 'Чеки не найдены' });

        res.json({ receipts: student.paymentReceipts });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

