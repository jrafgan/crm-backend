const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middlewares/uploadReceipt');
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.post(
    '/upload-receipt/:studentId',
    authMiddleware,
    upload,
    paymentController.createOrUploadPayment
);
router.get('/', paymentController.getPaymentsByStudent); // ?studentId=...
router.delete('/:id', paymentController.deletePayment);
router.get('/export', paymentController.exportPayments); // Excel выгрузка

module.exports = router;
