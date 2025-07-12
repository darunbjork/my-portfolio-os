const cloudinary = require('../config/cloudinaryConfig');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Upload profile image to Cloudinary
// @route   POST /api/v1/upload/profile-image
// @access  Private
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) {
      return next(new ErrorResponse('No file uploaded', 400));
    }

    // Upload image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'portfolio-profile-images', // Optional: folder in Cloudinary
      resource_type: 'image', // Ensure it's treated as an image
    });

    // Delete the local file after upload (Multer stores it temporarily)
    // fs.unlinkSync(req.file.path); // You'll need to import 'fs' for this

    res.status(200).json({
      success: true,
      data: {
        url: result.secure_url,
        public_id: result.public_id,
      },
    });
  } catch (error) {
    console.error('Error uploading image to Cloudinary:', error);
    return next(new ErrorResponse('Image upload failed', 500));
  }
};
