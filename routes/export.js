const express = require('express');
const router = express.Router();
const { exportUsers, exportStudents } = require('../controllers/exportController');
const authMiddleware = require('../middlewares/auth');
const roleMiddleware = require('../middlewares/roleMiddleware');

router.get('/users', authMiddleware, roleMiddleware(['admin']), exportUsers);
router.get('/students', authMiddleware, roleMiddleware(['admin']), exportStudents);

module.exports = router;
