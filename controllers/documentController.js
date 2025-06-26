const Document = require('../models/Document');
const Student = require('../models/Student');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).json({ message: 'Ученик не найден' });
        }

        // Сбор путей к файлам, если они загружены
        const receiptPaths = req.files && req.files.length > 0
            ? req.files.map(file => file.path)
            : [];

        const document = new Document({
            student: student._id,
            uploadedAt: new Date(),
            fileUrls: receiptPaths,
            uploadedBy: req.user.id
        });

        await document.save();

        res.status(201).json({
            message: 'Документ успешно загружен',
            document
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getDocumentsByStudent = async (req, res) => {
    try {
        const studentId = req.params.id;
        const documents = await Document.find({ student: studentId }).sort({ uploadedAt: -1 });
        res.status(200).json({ documents });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при получении документов', details: error.message });
    }
};