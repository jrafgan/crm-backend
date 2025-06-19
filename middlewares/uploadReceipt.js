const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/receipts'),
    filename:    (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `receipt_${req.params.id}_${Date.now()}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ['.pdf','.jpg','.jpeg'];
    cb(null, allowed.includes(path.extname(file.originalname).toLowerCase()));
};

module.exports = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5*1024*1024 }
}).single('receipt');
