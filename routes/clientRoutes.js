const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { authenticateToken } = require('../service/auth');

router.post('/clients', authenticateToken, clientController.registerClient);
router.get('/clients', authenticateToken, clientController.getClients);
router.get('/clients/:id', authenticateToken, clientController.getClientById);
router.put('/clients/:id', authenticateToken, clientController.updateClient);

module.exports = router;
