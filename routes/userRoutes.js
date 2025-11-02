const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const loginController = require('../controllers/loginController');
const { authenticateToken } = require('../service/auth');



router.post('/register', authenticateToken, userController.register);
router.post('/login', loginController.login);
router.get('/users', authenticateToken, userController.getUsers);
router.get('/users/:id', authenticateToken, userController.getUserById);
router.put('/users/:id/password', authenticateToken, userController.updatePassword);
router.delete('/users/:id', authenticateToken, userController.deleteUser);


module.exports = router;
