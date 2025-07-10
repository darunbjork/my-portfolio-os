// src/api/auth.js
// Why: This file defines the API routes for authentication.
// It uses an Express Router to keep our server.js file clean and organized.

const express = require('express');
const { register, login, getMe, updateUserRole, getUsers } = require('../controllers/authController');
const { protect, requireOwner } = require('../middleware/auth');

const router = express.Router();

// Public authentication routes
router.post('/register', register);
router.post('/login', login);

// Private routes (require authentication)
router.get('/me', protect, getMe);

// Owner-only routes for user management
router.get('/users', protect, requireOwner, getUsers);
router.put('/users/:userId/role', protect, requireOwner, updateUserRole);

module.exports = router;