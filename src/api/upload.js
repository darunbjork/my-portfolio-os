const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const { uploadProfileImage, uploadProjectImage } = require('../controllers/uploadController');

const router = express.Router();

// Set up Multer for file storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads/'); // Temporary directory to store uploaded files
  },
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '-' + file.originalname);
  },
});

// Filter for image files
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png' || file.mimetype === 'image/gif') {
    cb(null, true);
  } else {
    cb(new Error('Unsupported file format. Please upload JPEG, PNG, or GIF images.'), false);
  }
};

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5 // 5MB limit
  },
  fileFilter: fileFilter
});

// Route for profile image upload
router.post('/profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Route for project image upload
router.post('/project-image', protect, upload.single('projectImage'), uploadProjectImage);

module.exports = router;
