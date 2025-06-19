const express = require('express');
const router = express.Router();
const taskCtrl = require('../controllers/taskController');
const { authMiddleware } = require('../middlewares/auth');

router.post('/', authMiddleware, taskCtrl.createTask);
router.get('/', authMiddleware, taskCtrl.getTasks);
router.patch('/:id/complete', authMiddleware, taskCtrl.markComplete);

module.exports = router;
