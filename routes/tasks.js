const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/taskController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);

router.post('/', roleMiddleware(['admin']), taskCtrl.createTask);          // создать
router.get('/', taskCtrl.getTasks);                                        // все задачи
router.get('/:id', taskCtrl.getTaskById);                                  // по id
router.put('/:id', roleMiddleware(['admin']), taskCtrl.updateTask);        // обновить
router.delete('/:id', roleMiddleware(['admin']), taskCtrl.deleteTask);     // удалить
router.patch('/:id/complete', roleMiddleware(['teacher']), taskCtrl.toggleCompleteStatus); // завершить

module.exports = router;
