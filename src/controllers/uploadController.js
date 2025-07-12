const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs'); // Import fs for file system operations

// @desc    Upload profile image to Cloudinary
// @route   POST /api/v1/upload/profile-image
// @access  Private
exports.uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio-profile-images',
      resource_type: 'image'
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
};

// @desc    Upload project image to Cloudinary
// @route   POST /api/v1/upload/project-image
// @access  Private
exports.uploadProjectImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio-project-images', // Dedicated folder for project images
      resource_type: 'image'
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary project image upload error:', error);
    res.status(500).json({ message: 'Project image upload failed', error: error.message });
  }
};
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio-profile-images',
      resource_type: 'image'
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    res.status(500).json({ message: 'Image upload failed', error: error.message });
  }
;
