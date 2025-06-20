const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', paymentController.createPayment);
router.get('/', paymentController.getPaymentsByStudent); // ?studentId=...
router.delete('/:id', paymentController.deletePayment);
router.get('/export', paymentController.exportPayments); // Excel выгрузка

module.exports = router;
