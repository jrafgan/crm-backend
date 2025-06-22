const Payment = require('../models/Payment');
const Student = require('../models/Student');

// POST /payments
exports.createOrUploadPayment = async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        const { amount, method, paymentType } = req.body;

        if (!student) {
            return res.status(404).json({ message: 'Ученик не найден' });
        }

        // Сбор путей к файлам, если они загружены
        const receiptPaths = req.files && req.files.length > 0
            ? req.files.map(file => file.path)
            : [];

        const payment = new Payment({
            studentId: student._id,
            amount: parseFloat(amount) || 0,
            date: new Date(),
            method: method,
            paymentType,
            receiptUrl: receiptPaths,
            createdBy: req.user._id
        });

        await payment.save();

        res.status(201).json({
            message: 'Платёж успешно создан',
            payment
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /payments?studentId=...
exports.getPaymentsByStudent = async (req, res) => {
    try {
        const filter = {};
        if (req.query.studentId) filter.studentId = req.query.studentId;

        const payments = await Payment.find(filter).populate('studentId', 'name');
        res.json(payments);
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при получении оплат' });
    }
};

// DELETE /payments/:id
exports.deletePayment = async (req, res) => {
    try {
        await Payment.findByIdAndDelete(req.params.id);
        res.json({ message: 'Оплата удалена' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при удалении оплаты' });
    }
};

// GET /payments/export (пока просто заглушка)
exports.exportPayments = async (req, res) => {
    try {
        res.json({ message: 'Экспорт в Excel пока не реализован' });
    } catch (err) {
        res.status(500).json({ error: 'Ошибка при экспорте' });
    }
};
