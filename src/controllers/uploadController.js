const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs/promises'); // Use fs.promises for async operations
const path = require('path'); // Import path module
const sharp = require('sharp'); // Import sharp for image processing
const Profile = require('../models/Profile'); // Import Profile model
const User = require('../models/User'); // Import User model

// Reusable helper:
function makePublicUrl(req, filepath) {
  const base = process.env.BACKEND_URL
    || `${req.protocol}://${req.get('host')}`;
  // filepath is relative to project root, e.g. 'uploads/profiles/img.webp'
  return `${base}/${filepath.replace(/\\/g, '/')}`;
}

// @desc    Upload profile image
// @route   POST /api/v1/upload/profile-image
// @access  Private
//profileImageUrl
exports.uploadProfileImage = async (req, res, next) => {
  console.error('⚡ uploadProfileImage called for user', req.user?.id);
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });

    console.log('Received file for profile upload:', { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size });

    // 1a. Process and upload to Cloudinary
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio-profile-images',
      resource_type: 'auto',
      public_id: `profile-${req.user.id}`,
      overwrite: true,
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        { quality: 'auto' }
      ]
    });

    console.log('Profile image uploaded to Cloudinary:', result.secure_url);

    // 1b. Build public URL
    const profileImageUrl = result.secure_url;

    console.log('Generated profileImageUrl:', profileImageUrl);

    // 1c. Save on user
    // Assuming profileImageUrl is on the User model, or Profile model linked to User
    // Based on previous context, it's on Profile model
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      console.log('uploadProfileImage: No existing profile found, creating new one.');
      profile = new Profile({
        user: req.user.id,
        fullName: "Your Default Name", // Placeholder
        bio: "", // Placeholder
        profileImageUrl: profileImageUrl // Store full URL
      });
      console.log('uploadProfileImage: New profile object created:', profile);
    } else {
      console.log('uploadProfileImage: Existing profile found, updating.');
      profile.profileImageUrl = profileImageUrl; // Update full URL
      console.log('uploadProfileImage: Profile object after updating profileImageUrl:', profile);
    }
    const savedProfile = await profile.save();
    console.log('uploadProfileImage: Profile document saved/updated in DB. Saved profile:', savedProfile);

    return res.json({ success: true, url: profileImageUrl });
  } catch (err) {
    console.error('Profile image upload error:', err);
    return res.status(500).json({ message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  }
};

// @desc    Upload project image to Cloudinary
// @route   POST /api/v1/upload/project-image
// @access  Private
exports.uploadProjectImage = async (req, res, next) => {
  console.log('⚡️ Received uploadProjectImage request');
  try {
    if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

    console.log('Received file for project upload:', { originalname: req.file.originalname, mimetype: req.file.mimetype, size: req.file.size });

    // Upload buffer directly to Cloudinary
    console.log('Attempting to upload to Cloudinary...');
    const dataUri = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    const result = await cloudinary.uploader.upload(dataUri, {
      folder: 'portfolio-project-images', // Dedicated folder for project images
      resource_type: 'auto' // auto-detect file type
    });
    console.log('Cloudinary upload successful. Secure URL:', result.secure_url);

    return res.status(200).json({ success: true, url: result.secure_url });
  } catch (err) {
    console.error('Cloudinary project image upload error:', err);
    return res.status(500).json({ message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  }
};

// @desc    Upload resume PDF
// @route   POST /api/v1/upload/resume
// @access  Private
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });

    const filename = `resume-${req.user.id}-${Date.now()}${path.extname(req.file.originalname)}`;
    const relPath = `uploads/resumes/${filename}`;
    const fullPath = path.join(process.cwd(), relPath);

    await fs.mkdir(path.dirname(fullPath), { recursive: true });
    await fs.writeFile(fullPath, req.file.buffer);

    const resumeUrl = makePublicUrl(req, relPath);

    await Profile.findOneAndUpdate(
      { user: req.user.id },
      { resumeUrl },
      { new: true, runValidators: true }
    );

    return res.json({ success: true, url: resumeUrl });
  } catch (err) {
    console.error('Resume upload error:', err);
    return res.status(500).json({ message: err.message, stack: process.env.NODE_ENV === 'development' ? err.stack : undefined });
  }
};
