const cron = require('node-cron');
const Student = require('../models/Student');
const sendReminder = require('../utils/sendReminder');

cron.schedule('0 10 * * *', async () => {
    console.log('⏰ Запуск cron-задачи на отправку напоминаний...');

    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);

    const students = await Student.find({
        createdAt: { $lte: threeDaysAgo },
        paymentUploaded: false
    });

    for (const student of students) {
        if (student.phone) {
            const msg = `Здравствуйте, ${student.name || 'студент'}! Пожалуйста, оплатите обучение.`;
            await sendReminder(student.phone, msg);
        }
    }
});
