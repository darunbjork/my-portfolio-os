// src/api/auth.js
// Why: This file defines the API routes for user authentication.
// It uses an Express Router to keep authentication-related routes together.

const express = require('express');
const { register, login, getMe } = require('../controllers/authController'); // Import the controller functions
const { protect } = require('../middleware/auth'); // Import the protect middleware

const router = express.Router(); // Create a new router instance

// Why: Use our controller functions to handle requests for these routes.
// A POST request to /register will trigger the register function.
router.post('/register', register);

// A POST request to /login will trigger the login function.
router.post('/login', login);

// A GET request to /me will trigger the getMe function.
// We'll protect this route with middleware later.
router.get('/me', protect, getMe);

module.exports = router;