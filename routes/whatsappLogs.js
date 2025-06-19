const express = require('express');
const router = express.Router();
const logCtrl = require('../controllers/whatsappLogController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.get('/', authMiddleware, roleMiddleware(['admin']), logCtrl.getLogs);
router.get('/:phone', authMiddleware, roleMiddleware(['admin']), logCtrl.getLogsByPhone);

module.exports = router;
