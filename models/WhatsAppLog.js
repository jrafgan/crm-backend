const mongoose = require('mongoose');
const { Schema } = mongoose;

const whatsappLogSchema = new Schema({
    phone:   { type: String, required: true },
    message: { type: String, required: true },
    status:  { type: String, enum: ['sent', 'failed'], required: true },
    error:   { type: String },
    taskId:  { type: Schema.Types.ObjectId, ref: 'Task' } // использовать при необходимости
}, {
    timestamps: true
});

module.exports = mongoose.model('WhatsAppLog', whatsappLogSchema);
