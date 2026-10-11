const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');

router.get('/stats/student', auth, userController.getStudentStats);
router.get('/stats/dashboard', auth, adminOnly, userController.getDashboardStats);
router.get('/', auth, adminOnly, userController.getAllUsers);
router.get('/:id', auth, adminOnly, userController.getUserById);
router.put('/:id', auth, adminOnly, userController.updateUser);
router.delete('/:id', auth, adminOnly, userController.deleteUser);

module.exports = router;
