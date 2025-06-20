const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

// Получить все расписания (для админов и учителей)
router.get('/', scheduleController.getSchedules); // С фильтрами
router.get('/all', scheduleController.getAllSchedules); // Все

// Получить расписание по ID
router.get('/:id', scheduleController.getScheduleById);

// Создать расписание
router.post('/', roleMiddleware(['admin', 'teacher']), scheduleController.createSchedule);

// Обновить расписание
router.put('/:id', roleMiddleware(['admin', 'teacher']), scheduleController.updateSchedule);

// Удалить расписание (только админ)
router.delete('/:id', roleMiddleware(['admin']), scheduleController.deleteSchedule);

// Слоты
router.put('/:scheduleId/slot/:slotIndex', scheduleController.updateSlot);
router.delete('/:scheduleId/slot/:slotIndex', scheduleController.deleteSlot);
router.post('/:id/slot', scheduleController.addSlotToSchedule);
router.patch('/:id/slot/:index/assign-student', scheduleController.assignStudentToSlot);

// Копировать расписание на следующую неделю
router.post('/:id/copy', scheduleController.copyScheduleToNextWeek);

// Учет посещаемости
const attendanceController = require('../controllers/attendanceController');
router.post('/:scheduleId/slot/:slotIndex/attendance', attendanceController.markAttendance);
router.get('/attendance/report', attendanceController.getAttendanceReport);

module.exports = router;
