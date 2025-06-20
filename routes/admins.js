const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware, roleMiddleware(['admin']));

router.post('/', userController.createAdmin);
router.get('/', userController.getAdmins);
router.put('/:id', userController.updateAdmin);
router.delete('/:id', userController.deleteAdmin);

module.exports = router;
