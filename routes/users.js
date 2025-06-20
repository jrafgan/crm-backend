const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.get('/', authMiddleware, roleMiddleware(['admin']), userController.getAllUsers);
router.post('/', authMiddleware, roleMiddleware(['admin']), userController.createUser);

module.exports = router;
