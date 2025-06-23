# UCreate CRM Backend

CRM-сервер на Node.js с поддержкой ролей (admin, teacher, student), управлением студентами, заданиями, оплатами, расписанием и интеграцией с WhatsApp.

## 🚀 Установка

```bash
git clone https://github.com/your-org/ucreate-crm-backend.git
cd ucreate-crm-backend
npm install
cp .env.example .env
npm run dev
```

## ⚙️ Переменные окружения

```env
PORT=5000
MONGO_URI=ваш_mongo_uri
JWT_SECRET=секретный_ключ
```

## 📦 Возможности

- JWT-авторизация (admin, teacher, student)
- Студенты, расписание, задания, посещаемость
- Чеки и документы в PDF/JPEG
- Интеграция WhatsApp (baileys)
- Экспорт в Excel
- Swagger-документация

## 🧩 Основные маршруты

- `/auth` — вход, регистрация
- `/students` — CRUD, фильтрация, загрузка чеков
- `/payments` — загрузка оплат, просмотр
- `/documents` — загрузка документов
- `/schedule` — расписание, слоты, копирование
- `/attendance` — посещаемость
- `/tasks` — создание и статус заданий
- `/whatsapp` — отправка и логи
- `/reminder` — шаблоны уведомлений

## 📁 Структура

```
├── controllers/
├── routes/
├── models/
├── middlewares/
├── uploads/
├── cron/
├── utils/
└── swagger.yaml
```

## 🧪 Swagger

API-документация по адресу:
```
http://localhost:5000/api-docs
```
# Полный список endpoint'ов

- **POST** /auth/login
- **POST** /auth/register

- **GET** /students
- **POST** /students
- **GET** /students/{id}
- **PATCH** /students/{id}
- **DELETE** /students/{id}

- **POST** /documents/{id}/upload
- **GET** /documents/{id}/documents
- **DELETE** /documents/{docId}

- **POST** /payments/upload-receipt/{id}
- **GET** /payments

- **GET** /schedule
- **POST** /schedule/{id}/slot
- **PATCH** /schedule/{id}/slot/{slotIndex}/assign-student
- **POST** /schedule/{id}/copy

- **GET** /attendance
- **POST** /attendance/schedule/{scheduleId}/slot/{slotIndex}

- **GET** /tasks
- **POST** /tasks
- **GET** /tasks/{id}
- **PUT** /tasks/{id}
- **DELETE** /tasks/{id}
- **PATCH** /tasks/{id}/complete
- **PATCH** /tasks/{id}/toggle-status

- **PATCH** /reminder/update
- **GET** /reminder/{key}

- **POST** /whatsapp/send
- **POST** /whatsapp/bulk-send
- **GET** /whatsapp-logs
- **GET** /whatsapp-logs/{phone}

---
