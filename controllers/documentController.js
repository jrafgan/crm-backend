const Student = require('../models/Student');

exports.uploadReceipt = async (req, res) => {
    try {
        const studentId = req.params.id;
        const filePath = req.file.path;

        const student = await Student.findByIdAndUpdate(
            studentId,
            { receipt: filePath, paid: true },
            { new: true }
        );

        if (!student) {
            return res.status(404).json({ error: 'Ученик не найден' });
        }

        res.status(200).json({ success: true, student });
    } catch (error) {
        res.status(500).json({ error: 'Ошибка загрузки чека', details: error.message });
    }
};
