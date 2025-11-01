const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { authenticateToken } = require('../service/auth');

router.post('/projects', authenticateToken, projectController.registerProject);
router.get('/projects', authenticateToken, projectController.getProjects);
router.get('/projects/:id', authenticateToken, projectController.getProjectById);
router.put('/projects/:id', authenticateToken, projectController.updateProject);

module.exports = router;
