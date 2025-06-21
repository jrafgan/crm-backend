const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    fullName: String,
    phone: String,
    group: String,
    level: String,
    packageType: {
        type: String,
        enum: ['индивидуальный', 'углубленный', 'базовый', 'курс менеджера', 'экспресс']
    },
    paymentStatus: {
        type: String,
        enum: ['не оплатил', 'частично', 'полностью'],
        default: 'не оплатил'
    },
    paymentReceipts: [String], // массив путей к чекам
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

module.exports = mongoose.model('Student', studentSchema);
