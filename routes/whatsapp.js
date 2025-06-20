const express = require('express');
const router = express.Router();
const whatsappController = require('../controllers/whatsappController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/send', whatsappController.sendMessage); // одиночное
router.post('/bulk-send', roleMiddleware('admin'), whatsappController.sendBulkMessages); // массовая

module.exports = router;
