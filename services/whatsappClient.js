const { createBaileysClient } = require('@whiskeysockets/baileys'); // это псевдо-импорт
let client;

// Инициализация
const initWhatsApp = async () => {
    client = await createBaileysClient(); // ты можешь использовать свою логику авторизации
    console.log('📲 WhatsApp клиент инициализирован');
};

// Отправка сообщения
const sendMessage = async (phone, message) => {
    if (!client) throw new Error('WhatsApp клиент не инициализирован');

    const number = phone.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    await client.sendMessage(number, { text: message });
};

module.exports = { initWhatsApp, sendMessage };
