const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
    student: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    teacher: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: ['Присутствовал', 'Отсутствовал'], required: true },
    comment: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Attendance', attendanceSchema);
