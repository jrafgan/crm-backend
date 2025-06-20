const express = require('express');
const router = express.Router();
const exportController = require('../controllers/exportController');
const { authMiddleware, roleMiddleware } = require('../middlewares/auth');

router.use(authMiddleware);
router.use(roleMiddleware(['admin']));

router.get('/students', exportController.exportStudents);
router.get('/teachers', exportController.exportTeachers);
router.get('/admins', exportController.exportAdmins);

module.exports = router;
