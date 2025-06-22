const mongoose = require('mongoose');
const { Schema } = mongoose;

const studentSchema = new Schema({
    fullName: String,
    phone: String,
    group: String,
    packageType: {
        type: String,
        enum: ['индивидуальный', 'углубленный', 'базовый', 'курс менеджера', 'экспресс']
    },
    learningStatus: {
        type: String,
        enum: ['обучается', 'окончил', 'не закончил'],
        default: 'обучается'
    },
    paymentStatus: {
        type: String,
        enum: ['не оплатил', 'частично', 'полностью'],
        default: 'не оплатил'
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    teacherId: { type: Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

studentSchema.virtual('payments', {
    ref: 'Payment',
    localField: '_id',
    foreignField: 'studentId',
});

studentSchema.set('toObject', { virtuals: true });
studentSchema.set('toJSON', { virtuals: true });


module.exports = mongoose.model('Student', studentSchema);
