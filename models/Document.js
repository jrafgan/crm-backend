const mongoose = require('mongoose');
const fs = require('fs');

const documentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    fileUrls: [{
        type: String,
        required: true
    }],
    uploadedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    uploadedAt: {
        type: Date,
        default: Date.now
    }
});

// Удаление файлов при удалении записи
documentSchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    try {
        this.fileUrls.forEach(filePath => {
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        });
    } catch (err) {
        console.error('Ошибка при удалении файлов документа:', err);
    }
    next();
});

module.exports = mongoose.model('Document', documentSchema);

