const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.get('/', scheduleController.getSchedules);
router.get('/all', scheduleController.getAllSchedules);
router.get('/:id', scheduleController.getScheduleById);
router.post('/', roleMiddleware(['admin', 'teacher']), scheduleController.createSchedule);
router.put('/:id', roleMiddleware(['admin', 'teacher']), scheduleController.updateSchedule);
router.delete('/:id', roleMiddleware(['admin']), scheduleController.deleteSchedule);

router.put('/:scheduleId/slot/:slotIndex', scheduleController.updateSlot);
router.delete('/:scheduleId/slot/:slotIndex', scheduleController.deleteSlot);
router.post('/:id/slot', scheduleController.addSlot);
router.patch('/:id/slot/:index/assign-student', scheduleController.assignStudentToSlot);

router.post('/:id/copy', scheduleController.copyScheduleToNextWeek);

/*const attendanceController = require('../controllers/attendanceController');
router.post('/:scheduleId/slot/:slotIndex/attendance', attendanceController.markAttendance);
router.get('/attendance/report', attendanceController.getAttendanceReport);*/

module.exports = router;

