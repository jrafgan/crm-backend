const Payment = require('../models/Payment');

// POST /payments
exports.createPayment = async (req, res) => {
    try {
        const payment = new Payment(req.body);
        await payment.save();
        res.status(201).json(payment);
    } catch (err) {
        res.status(400).json({ error: 'Ошибка при создании оплаты', details: err.message });
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
