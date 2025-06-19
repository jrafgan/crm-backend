// 📁 services/whatsappClient.js
const { sendMessageBaileys } = require('../utils/baileysClient');

exports.sendMessage = async (phone, message) => {
    return await sendMessageBaileys(phone, message);
};
