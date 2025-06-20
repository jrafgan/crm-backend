const mongoose = require('mongoose');
const { Schema } = mongoose;

const attendanceSchema = new Schema({
    student: {
        type: Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    teacher: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enum: ['Присутствовал', 'Отсутствовал'],
        default: 'Присутствовал',
        required: true
    },
    lessonType: {
        type: String,
        enum: ['Индивидуальный', 'Базовый', 'Экспресс', 'Углубленный', 'Курс менеджера'],
        default: 'Individual'
    },
    comment: {
        type: String,
        maxlength: 500
    },
    scheduleId: {
        type: Schema.Types.ObjectId,
        ref: 'Schedule'
    },
    slotIndex: {
        type: Number
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Attendance', attendanceSchema);
