const express = require('express');
const router = express.Router();
const ctrl = require('../controllers/documentController');
const uploadDocument = require('../middlewares/uploadDocument');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.post(
    '/:id/upload',
    roleMiddleware(['admin', 'teacher']),
    uploadDocument,
    ctrl.uploadDocument
);

router.get(
    '/:id/documents',
    roleMiddleware(['admin', 'teacher']),
    ctrl.getDocumentsByStudent
);

module.exports = router;

