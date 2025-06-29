const mongoose = require('mongoose');
const { Schema } = mongoose;

const taskSchema = new Schema({
    title:       { type: String, required: true },
    description: { type: String },
    dueDate:     { type: Date },
    status:      { type: String, enum: ['Не выполнено','Выполнено'], default: 'Не выполнено' },
    assignedTo:  { type: Schema.Types.ObjectId, ref: 'User' },
    toAllTeachers: { type: Boolean, default: false },
    createdBy:   { type: Schema.Types.ObjectId, ref: 'User', required: true }, // ← добавлено
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
