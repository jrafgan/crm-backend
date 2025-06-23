
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,          // ← add this
} = require('@whiskeysockets/baileys');
const P = require('pino');
const qrcode = require('qrcode');
let latestQR = null;

let client;

const initWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');

    client = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
    });

    client.ev.on('connection.update', ({ connection, lastDisconnect , qr}) => {

        if (qr) {
            latestQR = qr;
            //qrcode.generate(qr, { small: true });
            console.log('📷 QR-код для авторизации:\n');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect.error?.output?.statusCode
                !== DisconnectReason.loggedOut;
            console.log('❌ WhatsApp отключен', lastDisconnect.error,
                shouldReconnect ? '— переподключаемся' : '');
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
    sendMessage: async (phone, text) => {
        await client.sendMessage(phone, { text });
    },
    getClient: () => client,   // остаётся как есть
    getQR:      () => latestQR, // возвращает последнюю строку QR
    client                        // сам объект сокета, если нужно обращаться напрямую
};
