const cron = require('node-cron');
const Student = require('../models/Student');
const sendReminder = require('../utils/sendReminder');
const ReminderTemplate = require('../models/Reminder');

cron.schedule('0 10 * * *', async () => {
    console.log('⏰ Запуск cron-задачи на отправку напоминаний...');

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const students = await Student.find({
        createdAt: { $lte: threeDaysAgo },
        paymentUploaded: false
    });

    const template = await ReminderTemplate.findOne({ key: 'payment_reminder' });
    const defaultMsg = `Здравствуйте, {{name}}! Пожалуйста, оплатите обучение.`;

    for (const student of students) {
        if (student.phone) {
            const msg = (template?.message || defaultMsg).replace('{{name}}', student.fullName || 'студент');
            await sendReminder(student.phone, msg);
        }
    }
});
