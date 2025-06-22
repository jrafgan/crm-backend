const mongoose = require('mongoose');
const { Schema } = mongoose;

const slotSchema = new Schema({
    day: {
        type: String,
        enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
        required: true
    },
    time: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Неверный формат времени']
    },
    duration: {
        type: Number,
        default: 2, // урок всегда 2 часа
        enum: [2]   // если хочешь оставить возможность расширения — убери enum
    },
    packageType: {
        type: String,
        enum: ['базовый', 'индивидуальный', 'курс менеджера', 'экспресс', 'углубленный']
    },
    studentIds: [{
        type: Schema.Types.ObjectId,
        ref: 'Student'
    }],
    isGroup: {
        type: Boolean,
        default: false
    },
    groupName: {
        type: String,
        default: '' // Например: "База-1" или "Группа A"
    }
}, { _id: false });

module.exports = slotSchema;
