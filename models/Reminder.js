const mongoose = require('mongoose');

const reminderTemplateSchema = new mongoose.Schema({
    key: {
        type: String,
        required: true,
        unique: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

module.exports = mongoose.model('ReminderTemplate', reminderTemplateSchema);
