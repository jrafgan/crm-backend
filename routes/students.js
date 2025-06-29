const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const { authMiddleware } = require('../middlewares/auth');
const uploadReceipt = require('../middlewares/uploadReceipt');
router.use(authMiddleware);

router.post('/', studentController.createStudent);
router.get('/', studentController.getStudents);
router.get('/:id', studentController.getStudentById);
router.put('/:id', studentController.updateStudent);
router.delete('/:id', studentController.deleteStudent);
router.get('/filter/payment', studentController.getStudentsByPaymentStatus);
router.get('/:id/with-receipt', studentController.getStudentWithReceipts); //возвращает всех учеников

module.exports = router;
