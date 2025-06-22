const mongoose = require('mongoose');
const { Schema } = mongoose;

const paymentSchema = new Schema({
    studentId:     { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    amount:        { type: Number, required: true },
    date:          { type: Date, default: Date.now },
    method:        { type: String, required: true, enum: ['наличные', 'без наличный'], default: 'без наличный' }, // пример: "наличные", "карта"
    paymentType:   { type: String, enum: ['не оплатил', 'частично', 'полностью'], default: 'не оплатил' },
    receiptUrl:    [{ type: String }], // путь до файла: pdf или jpeg
    createdBy:     { type: Schema.Types.ObjectId, ref: 'User', required: true }
}, {
    timestamps: true
});

module.exports = mongoose.model('Payment', paymentSchema);
