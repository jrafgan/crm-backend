const Document = require('../models/Document');
const Student = require('../models/Student');
const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

exports.uploadDocument = async (req, res) => {
    try {
        const studentId = req.params.id;
        const files = req.files;

        const student = await Student.findById(studentId);
        if (!student) {
            return res.status(404).json({ error: 'Ученик не найден' });
        }

        if (!files || files.length === 0) {
            return res.status(400).json({ error: 'Файлы не загружены' });
        }

        const fileUrls = await Promise.all(files.map(async (file) => {
            const ext = path.extname(file.originalname).toLowerCase();
            const targetPath = file.path.replace(ext, `_compressed${ext}`);

            if (['.jpg', '.jpeg', '.png'].includes(ext)) {
                await sharp(file.path)
                    .resize({ width: 1200 })
                    .jpeg({ quality: 70 })
                    .toFile(targetPath);
                fs.unlinkSync(file.path);
                return targetPath;
            }

            return file.path;
        }));

        const document = await Document.create({
            student: studentId,
            fileUrls,
            uploadedBy: req.user._id
        });

        res.status(200).json({ success: true, document });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка загрузки документов', details: error.message });
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