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

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only images are allowed!'), false);
    }
  }
});

// Route for profile image upload
router.post('/profile-image', protect, upload.single('profileImage'), uploadProfileImage);

// Route for project image upload
router.post('/project-image', protect, upload.single('projectImage'), uploadProjectImage);

module.exports = router;
