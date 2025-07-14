const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { uploadProfileImage, uploadProjectImage, uploadResume } = require('../controllers/uploadController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10*1024*1024 } });

const router = express.Router();

// Profile image field must be named 'image'
router.post('/profile-image', protect, upload.single('image'), uploadProfileImage);

// Project image field must be named 'image'
router.post('/project-image', protect, upload.single('image'), uploadProjectImage);

// Resume field must be named 'resume'
router.post('/resume', protect, upload.single('resume'), uploadResume);

module.exports = router;