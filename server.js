const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes');
require('dotenv').config();
const fs = require('fs');
const path = require('path');

// Создаём папки для загрузок
['uploads/receipts','uploads/payments','uploads/documents'].forEach(dir => {
    const full = path.join(__dirname, dir);
    if (!fs.existsSync(full)) fs.mkdirSync(full, { recursive: true });
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log('✅ Подключено к MongoDB'))
    .catch(err => console.error('Ошибка MongoDB:', err));

const app = express();
app.use(express.json());

// Подключаем маршруты
routes(app);

// Инициализируем WhatsApp-клиент
const { initWhatsApp } = require('./services/whatsappClient');
initWhatsApp();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Сервер запущен на порту ${PORT}`));
