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
exports.uploadProfileImage = async (req, res, next) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'No file' });

    // 1a. Process & write file
    const filename = `profile-${req.user.id}-${Date.now()}.webp`;
    const relPath = `uploads/profiles/${filename}`;
    const fullPath = path.join(process.cwd(), relPath);

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    await sharp(req.file.buffer)
      .resize(400, 400, { fit: 'cover', position: 'center' })
      .webp({ quality: 80 })
      .toFile(fullPath);

    // 1b. Build public URL
    const profileImageUrl = makePublicUrl(req, relPath);

    // 1c. Save on user
    // Assuming profileImageUrl is on the User model, or Profile model linked to User
    // Based on previous context, it's on Profile model
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      profile = new Profile({
        user: req.user.id,
        fullName: "Your Default Name", // Placeholder
        bio: "", // Placeholder
        profileImage: filename, // Store filename
        profileImageUrl: profileImageUrl // Store full URL
      });
    } else {
      profile.profileImage = filename; // Update filename
      profile.profileImageUrl = profileImageUrl; // Update full URL
    }
    await profile.save();

    return res.json({ success: true, url: profileImageUrl });
  } catch (err) {
    console.error('Profile image upload error:', err);
    return next(err);
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
    return next(err);
  }
};