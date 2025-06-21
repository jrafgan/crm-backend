const authRoutes = require('./auth');
const userRoutes = require('./users');
const adminRoutes = require('./admins');
const studentRoutes = require('./students');
const paymentRoutes = require('./payments');
const scheduleRoutes = require('./schedule');
const taskRoutes = require('./tasks');
const reminderRoutes = require('./reminder');
const documentRoutes = require('./documents');
const whatsappRoutes = require('./whatsapp');
const whatsappLogsRoutes = require('./whatsappLogs');
const exportRoutes = require('./export');
const attendanceRoutes = require('./attendance');

module.exports = (app) => {

    app.use('/auth', authRoutes);
    app.use('/admins', adminRoutes);
    app.use('/users', userRoutes);
    app.use('/students', studentRoutes);
    app.use('/payments', paymentRoutes);
    app.use('/schedule', scheduleRoutes);
    app.use('/tasks', taskRoutes);
    app.use('/reminder', reminderRoutes);
    app.use('/documents', documentRoutes);
    app.use('/whatsapp', whatsappRoutes);
    app.use('/whatsapp-logs', whatsappLogsRoutes);
    app.use('/export', exportRoutes);
    app.use('/attendance', attendanceRoutes);
};
