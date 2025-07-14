// src/api/profile.js
const express = require('express');
const { getProfile, createProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProfile) // Get current user's profile (publicly accessible)
  .post(protect, createProfile) // Create user profile
  .put(protect, updateProfile); // Update user profile

router.route('/:id')
  .delete(protect, deleteProfile); // Delete user profile

module.exports = router;
