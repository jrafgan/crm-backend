// services/whatsappClient.js
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
} = require('@whiskeysockets/baileys');
const P = require('pino');
const qrcode = require('qrcode');

let latestQR = null;
let client;
let isReady = false; // флаг готовности

function normalizeJid(phone) {
    const digits = phone.replace(/\D/g, '');
    return `${digits}@s.whatsapp.net`;
}

const initWhatsApp = async () => {
    const { state, saveCreds } = await useMultiFileAuthState('./auth');

    client = makeWASocket({
        auth: state,
        logger: P({ level: 'silent' }),
    });

    client.ev.on('connection.update', async ({ connection, lastDisconnect, qr }) => {
        if (qr) {
            latestQR = qr;
            console.log('📷 QR-код для авторизации:');
        }

        if (connection === 'close') {
            const shouldReconnect = lastDisconnect?.error?.output?.statusCode !== DisconnectReason.loggedOut;
            console.log('❌ WhatsApp отключен', lastDisconnect?.error, shouldReconnect ? '— переподключаемся' : '');
            isReady = false;
            if (shouldReconnect) await initWhatsApp();
        } else if (connection === 'open') {
            isReady = true;
            console.log('✅ WhatsApp подключен');
        }
    });

    client.ev.on('creds.update', saveCreds);
};

const sendMessage = async (phone, text) => {
    if (!client || !isReady) {
        throw new Error('Клиент WhatsApp не готов для отправки сообщений');
    }
    const jid = normalizeJid(phone);
    return await client.sendMessage(jid, { text });
};

module.exports = {
    initWhatsApp,
    sendMessage,
    getClient: () => client,
    getQR: () => latestQR,
    client,
    normalizeJid
};
