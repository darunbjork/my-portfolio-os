const express = require('express');
const { getProfile, createProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, getProfile) // Get current user's profile
  .post(protect, createProfile) // Create user profile
  .put(protect, updateProfile); // Update user profile

module.exports = router;
