const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    studentId:  { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    amount:     { type: Number, required: true },
    date:       { type: Date, default: Date.now },
    method:     { type: String, required: true },
    status:     { type: String, enum: ['pending','completed','failed'], default: 'completed' },
    receiptPdf: { type: String },
    createdBy:  { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
