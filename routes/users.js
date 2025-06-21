const express = require('express');
const router = express.Router();
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');
const userController = require('../controllers/userController');

router.use(authMiddleware, roleMiddleware(['admin']));

router.post('/', userController.createUser); // Создание пользователя (ученика, учителя и т.д.)
router.get('/', userController.getAllUsers); // Получение всех пользователей (по role)
router.get('/', userController.getUsers); // Получение пользователей по фильтру
router.get('/:id', userController.getUserById); // Получение одного пользователя
router.put('/:id', userController.updateUser); // Обновление пользователя
router.delete('/:id', userController.deleteUser); // Удаление пользователя

module.exports = router;
