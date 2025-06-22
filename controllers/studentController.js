const path = require('path');
const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
    try {
        const data = {
            fullName:  req.body.fullName,
            phone:     req.body.phone,
            group:     req.body.group,
            packageType: req.body.packageType,
            paymentStatus: req.body.paymentStatus,
            learningStatus: req.body.learningStatus,
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
            fullName,
            phone,
            group,
            teacherId,
            packageType,
            learningStatus,
            paymentStatus
        } = req.query;

        const filter = {};

        if (group) filter.group = group;
        if (teacherId) filter.teacherId = teacherId;
        if (learningStatus) filter.learningStatus = learningStatus;
        if (packageType) filter.packageType = packageType;
        if (paymentStatus) filter.paymentStatus = paymentStatus;
        if (fullName) filter.fullName = { $regex: fullName, $options: 'i' }; // Поиск по имени
        if (phone) filter.phone = { $regex: phone, $options: 'i' };         // Поиск по телефону

        // Если пользователь — преподаватель, он видит только своих учеников
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

exports.getStudentsByPaymentStatus = async (req, res) => {
    try {
        const { paymentStatus } = req.query;

        const filter = {};
        if (paymentStatus) {
            filter.paymentStatus = paymentStatus;
        }

        const students = await Student.find(filter)
            .populate('teacherId', 'fullName')
            .select('fullName phone group paymentStatus packageType');

        res.json(students);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при фильтрации студентов', error: err.message });
    }
};

exports.getStudentWithReceipts = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('teacherId', 'fullName')
            .select('fullName phone group packageType paymentStatus paymentReceipts');

        if (!student) return res.status(404).json({ message: 'Ученик не найден' });

        res.json(student);
    } catch (err) {
        res.status(500).json({ message: 'Ошибка при получении ученика', error: err.message });
    }
};


