const makeWASocket = require('@whiskeysockets/baileys').default;
const { useMultiFileAuthState } = require('@whiskeysockets/baileys');
const P = require('pino');

let client;

const initWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');

    client = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
    });

    client.ev.on('connection.update', ({ connection, lastDisconnect , qr}) => {
        if (qr) {
            console.log('📷 QR-код для авторизации:\n', qr);
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== 401;
            console.log('Connection closed. Reconnecting:', shouldReconnect);
            if (shouldReconnect) initWhatsApp();
        } else if (connection === 'open') {
            console.log('✅ WhatsApp подключен');
            // ✅ Только теперь безопасно отправлять сообщение
            sendMessage('+996507391773', '👋 Привет! WhatsApp бот подключен!');
        }
    });

    client.ev.on('creds.update', saveCreds);
};

const sendMessage = async (phone, message) => {
    if (!client || !client.user?.id) {
        throw new Error('WhatsApp клиент не готов для отправки сообщений');
    }

    const number = phone.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    try {
        await client.sendMessage(number, {text: message});
        console.log(`📤 Сообщение отправлено на ${phone}`);
    } catch (err) {
        console.error('❌ Ошибка отправки сообщения:', err.message);
    }

};


module.exports = {
    initWhatsApp,
    sendMessage,
    getClient: () => client
};
