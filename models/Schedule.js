const mongoose = require('mongoose');
const { Schema } = mongoose;
const slotSchema = require('./Slot'); // если вынесен в отдельный файл

const scheduleSchema = new Schema({
    teacherId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    weekStart: {
        type: Date,
        required: true
    },
    slots: {
        type: [slotSchema],
        // validate: [slots => slots.length > 0, 'Должен быть хотя бы один слот'] — отключено для гибкости
// Уберите комментарий, если нужна жёсткая валидация
// validate: [slots => slots.length > 0, 'Должен быть хотя бы один слот']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);

