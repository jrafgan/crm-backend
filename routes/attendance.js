const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const { authMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

// Маршрут для отметки посещения
router.post('/:scheduleId/slot/:slotIndex', attendanceController.markAttendance);

// Получение отчета по фильтрам
router.get('/report', attendanceController.getAttendanceReport);

module.exports = router;
