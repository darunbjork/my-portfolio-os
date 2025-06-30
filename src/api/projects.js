// src/api/projects.js
// Why: This file defines the API routes for our Project resource.
// It uses an Express Router and applies our authentication middleware.

const express = require('express');
const {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
} = require('../controllers/projectController');
const { protect } = require('../middleware/auth'); // Import our authentication middleware

const router = express.Router();

// Public routes for reading projects
// Why: These routes are public, so anyone can view the portfolio.
router.route('/').get(getProjects);
router.route('/:id').get(getProject);

// Private routes for creating, updating, and deleting projects
// Why: These routes require a valid JWT token to access, enforced by the 'protect' middleware.
router.route('/').post(protect, createProject);
router.route('/:id').put(protect, updateProject).delete(protect, deleteProject);

module.exports = router;