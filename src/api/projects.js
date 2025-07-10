// src/api/projects.js
// Why: This file defines the API routes for our Project resource.
// It uses an Express Router and applies our authentication middleware.
// It also applies the advancedResults middleware to handle complex queries.

const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect, requireOwnerOrAdmin } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults'); // Import the new middleware
const Project = require('../models/Project'); // Import the Project model for the middleware

const router = express.Router();

// Public routes for reading projects
// Why: Apply the advancedResults middleware to the GET request.
// We pass the Project model and the population option.
router.route('/')
  .get(advancedResults(Project, { path: 'user', select: 'email' }), getProjects)
  .post(protect, requireOwnerOrAdmin, createProject); // Only owner/admin can create projects

router.route('/:id')
  .get(getProject)
  .put(protect, requireOwnerOrAdmin, updateProject)   // Only owner/admin can update projects
  .delete(protect, requireOwnerOrAdmin, deleteProject); // Only owner/admin can delete projects

module.exports = router;