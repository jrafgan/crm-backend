const mongoose = require('mongoose');
const { Schema } = mongoose;
const slotSchema = require('./Slot');

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
        type: [slotSchema]
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Schedule', scheduleSchema);
