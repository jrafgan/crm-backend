const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');
const scheduleController = require('../controllers/scheduleController');

router.use(authMiddleware);

router.get('/', scheduleController.getSchedule);
router.post('/', roleMiddleware(['teacher', 'admin']), scheduleController.createSchedule);

module.exports = router;
