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
      resource_type: 'image',
      upload_preset: 'portfolio_unsigned' // Must match Cloudinary dashboard
    });

    // Clean up temp file
    fs.unlinkSync(req.file.path);

    res.status(200).json({ url: result.secure_url });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    res.status(500).json({ message: 'Image upload failed' });
  }
};
