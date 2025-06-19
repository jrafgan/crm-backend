const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
    name: String,
    phone: String,
    group: String,
    level: {
        type: String,
        enum: ['Beginner', 'Elementary', 'Pre-Intermediate', 'Intermediate', 'Upper-Intermediate', 'Advanced']
    },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    startDate: Date,
    status: { type: String, default: 'Активен' }, // например: Активен, Пауза, Удален
    paymentStatus: { type: String, enum: ['Оплачено', 'Не оплачено'], default: 'Не оплачено' }
}, { timestamps: true }); // createdAt включён

module.exports = mongoose.model('Student', studentSchema);
