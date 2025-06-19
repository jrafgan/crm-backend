const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/documentController');
const uploadReceipt = require('../middlewares/uploadDocument');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.post(
    '/:id/receipt',
    authMiddleware,
    roleMiddleware(['admin', 'teacher']),
    uploadReceipt,
    ctrl.uploadReceipt
);

module.exports = router;
