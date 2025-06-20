require('dotenv').config(); // Сначала загружаем .env

const express = require('express');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

const { initWhatsApp } = require('./services/whatsappClient');
const routes = require('./routes'); // routes должен экспортировать функцию (app) => {...}

// Создание директорий
['uploads/receipts', 'uploads/payments', 'uploads/documents'].forEach(dir => {
    const full = path.join(__dirname, dir);
    if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // отдаём файлы

// Подключаем все маршруты
routes(app);

// WhatsApp клиент
initWhatsApp();

// 404 fallback
app.use((req, res, next) => {
    res.status(404).json({ message: 'Маршрут не найден' });
});

// Запуск сервера
const PORT = process.env.PORT || 5000;
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => {
        console.log('✅ Подключено к MongoDB');
        app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
    })
    .catch(err => console.error('❌ Ошибка подключения к MongoDB:', err));
