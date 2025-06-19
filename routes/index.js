const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./users');
const studentRoutes = require('./students');
const paymentRoutes = require('./payments');
const scheduleRoutes = require('./schedule');
const taskRoutes = require('./tasks');
const documentRoutes = require('./documents');
const whatsappRoutes = require('./whatsapp');
const whatsappLogsRoutes = require('./whatsappLogs');
const exportRoutes = require('./export');
const attendanceRoutes = require('./attendance'); // ← добавляем

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/students', studentRoutes);
router.use('/payments', paymentRoutes);
router.use('/schedule', scheduleRoutes);
router.use('/tasks', taskRoutes);
router.use('/documents', documentRoutes);
router.use('/whatsapp', whatsappRoutes);
router.use('/whatsapp-logs', whatsappLogsRoutes);
router.use('/export', exportRoutes);
router.use('/attendance', attendanceRoutes); // ← подключаем

module.exports = router;
