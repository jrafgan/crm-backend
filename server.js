require('dotenv').config(); // Сначала загружаем .env

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const routes = require('./routes'); // routes должен экспортировать функцию (app) => {...}
const qrcode = require('qrcode');
const { initWhatsApp, sendMessage, getQR } = require('./services/whatsappClient');
// Создание директорий
['uploads/receipts', 'uploads/payments', 'uploads/documents'].forEach(dir => {
    const full = path.join(__dirname, dir);
    if (!fs.existsSync(full)) fs.mkdirSync(full, {recursive: true});
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // отдаём файлы

// Подключаем все маршруты
routes(app);

// QR-endpoint — возвращает картинку
app.get('/qr', async (req, res) => {
    const qrString = getQR();
    if (!qrString) {
        return res.send('QR ещё не сгенерирован, подожди пару секунд.');
    }
    // Генерируем Data URL с QR-кодом
    try {
        const dataUrl = await qrcode.toDataURL(qrString);
        res.send(`<img src="${dataUrl}" alt="WhatsApp QR Code"/>`);
    } catch (err) {
        res.status(500).send('Не удалось сгенерировать QR-код');
    }
});


// 404 fallback
app.use((req, res, next) => {
    res.status(404).json({message: 'Маршрут не найден'});
});

// Запуск сервера
const PORT = process.env.PORT || 5000;

// Основная инициализация в async-функции
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log('✅ Подключено к MongoDB');

        app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));

        await initWhatsApp();
    } catch (err) {
        console.error('❌ Ошибка запуска сервера:', err);
    }
};

startServer();