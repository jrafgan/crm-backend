const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    fullName:  { type: String, required: true },
    phone:     { type: String, required: true, unique: true },
    password:  { type: String, required: true },
    role:      { type: String, enum: ['admin','teacher','student'], default: 'student' },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' }
}, {
    timestamps: true
});

module.exports = mongoose.model('User', userSchema);
