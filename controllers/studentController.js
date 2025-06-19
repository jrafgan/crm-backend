const path = require('path');
const Student = require('../models/Student');

exports.createStudent = async (req, res) => {
    try {
        const data = {
            fullName:  req.body.fullName,
            phone:     req.body.phone,
            group:     req.body.group,
            level:     req.body.level,
            createdBy: req.user.id,
            teacherId: req.user.role === 'teacher' ? req.user.id : req.body.teacherId
        };
        const student = await Student.create(data);
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.getStudents = async (req, res) => {
    try {
        const { group, status, paid, teacherId, periodStart, periodEnd } = req.query;
        const filter = {};
        if (group)      filter.group      = group;
        if (status)     filter.status     = status;
        if (paid !== undefined) filter.paid = paid === 'true';
        if (teacherId)  filter.teacherId  = teacherId;
        if (periodStart || periodEnd) {
            filter.createdAt = {};
            if (periodStart) filter.createdAt.$gte = new Date(periodStart);
            if (periodEnd)   filter.createdAt.$lte = new Date(periodEnd);
        }
        if (req.user.role === 'teacher') filter.createdBy = req.user.id;
        const students = await Student.find(filter).populate('teacherId','fullName');
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getStudentById = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id).populate('teacherId','fullName');
        if (!student) return res.status(404).json({ message: 'Студент не найден' });
        if (req.user.role==='teacher' && student.createdBy.toString()!==req.user.id) {
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
        if (req.user.role==='teacher' && student.createdBy.toString()!==req.user.id) {
            return res.status(403).json({ message: 'Доступ запрещён' });
        }
        Object.assign(student, req.body);
        await student.save();
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteStudent = async (req, r
