const express = require('express');
const router = express.Router();
const loginController = require('../controllers/userController');
const { authenticateToken } = require('../service/auth');

router.post('/register', authenticateToken, loginController.register);
router.get('/users', authenticateToken, loginController.getUsers);
router.get('/users/:id', authenticateToken, loginController.getUserById);
router.put('/users/:id/password', authenticateToken, loginController.updatePassword);
router.delete('/users/:id', authenticateToken, loginController.deleteUser);

module.exports = router;
