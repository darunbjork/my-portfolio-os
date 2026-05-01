const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { uploadProfileImage, uploadResume, uploadProjectImage } = require('../controllers/uploadController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10*1024*1024 } });

const router = express.Router();

router.post('/profile-image', protect, upload.single('profileImage'), uploadProfileImage);

router.post('/resume', protect, upload.single('resume'), uploadResume);

router.post('/project-image', protect, upload.single('projectImage'), uploadProjectImage);

module.exports = router;