const express = require('express');
const { getProfile, createProfile, updateProfile, deleteProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getProfile) 
  .post(protect, createProfile) 
  .put(protect, updateProfile);

router.route('/:id')
  .delete(protect, deleteProfile);

module.exports = router;
