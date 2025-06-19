const mongoose = require('mongoose');
const { Schema } = mongoose;

const slotSchema = new Schema({
    day: {
        type: String,
        enum: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
        required: true
    },
    time: {
        type: String,
        required: true,
        match: [/^([01]\d|2[0-3]):([0-5]\d)$/, 'Неверный формат времени']
    },
    type: {
        type: String,
        enum: ['Individual','Express','Deep','Group'],
        required: true
    },
    studentId: {
        type: Schema.Types.ObjectId,
        ref: 'Student'
    },
    groupName: {
        type: String
    }
}, { _id: false });

const scheduleSchema = new Schema({
    teacherId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    weekStart: { type: Date, required: true },
    slots: {
        type: [slotSchema],
        validate: [slots => slots.length > 0, 'Должен быть хотя бы один слот']
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);
