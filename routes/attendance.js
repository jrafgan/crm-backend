const express = require('express');
const router = express.Router();
const attendanceCtrl = require('../controllers/attendanceController');
const { authMiddleware } = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.post('/', authMiddleware, roleMiddleware(['teacher']), attendanceCtrl.markAttendance);
router.get('/', authMiddleware, roleMiddleware(['admin', 'teacher']), attendanceCtrl.getAttendance);

module.exports = router;
