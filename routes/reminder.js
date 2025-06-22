const express = require('express');
const router = express.Router();
const controller = require('../controllers/reminderController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/:key', controller.getReminderMessage);
router.patch('/update', controller.updateReminderMessage);

module.exports = router;