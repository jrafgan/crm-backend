const axios = require('axios');

async function sendReminder(phone, message) {
    try {
        const response = await axios.post('http://localhost:5000/api/whatsapp/send', {
            phone,
            message
        });
        console.log('Напоминание отправлено:', response.data);
    } catch (err) {
        console.error('Ошибка отправки напоминания:', err.message);
    }
}

module.exports = sendReminder;
