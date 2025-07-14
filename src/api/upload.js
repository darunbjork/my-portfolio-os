const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { uploadProfileImage, uploadResume, uploadProjectImage } = require('../controllers/uploadController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10*1024*1024 } });

const router = express.Router();

// Profile image field must be named 'profileImage'
router.post('/profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Resume field must be named 'resume'
router.post('/resume', protect, upload.single('resume'), uploadResume);

router.post('/project-image', protect, upload.single('projectImage'), uploadProjectImage);

module.exports = router;