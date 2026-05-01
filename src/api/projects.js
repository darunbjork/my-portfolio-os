const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, requireOwnerOrAdmin } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults'); 
const Project = require('../models/Project'); 

const router = express.Router();

router.route('/')
  .get(advancedResults(Project, { path: 'user', select: 'email' }), getProjects)
  .post(protect, requireOwnerOrAdmin, createProject); 

router.route('/:id')
  .get(getProject)
  .put(protect, requireOwnerOrAdmin, updateProject)  
  .delete(protect, requireOwnerOrAdmin, deleteProject);

module.exports = router;