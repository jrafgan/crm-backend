const express = require('express');
const router = express.Router();
const multer = require('multer');
const upload = require('../middlewares/uploadReceipt');
const paymentController = require('../controllers/paymentController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.post(
    '/upload/:id',
    authMiddleware,
    upload,
    paymentController.createOrUploadPayment
);
router.get('/:id', paymentController.getPaymentsByStudent); // ?studentId=...
router.delete('/:id', paymentController.deletePayment);

module.exports = router;
