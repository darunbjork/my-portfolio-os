const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get current user's profile
// @route   GET /api/v1/profile
// @access  Private
exports.getProfile = async (req, res, next) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate({
      path: 'user',
      select: 'email'
    });

    if (!profile) {
      return next(new ErrorResponse('Profile not found for this user', 404));
    }

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create user profile
// @route   POST /api/v1/profile
// @access  Private
exports.createProfile = async (req, res, next) => {
  try {
    // Check if profile already exists for this user
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      return next(new ErrorResponse('Profile already exists for this user. Use PUT to update.', 400));
    }

    // Add user to req.body
    req.body.user = req.user.id;

    profile = await Profile.create(req.body);

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/v1/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    let profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
      return next(new ErrorResponse('Profile not found for this user. Use POST to create.', 404));
    }

    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: profile
    });
  } catch (error) {
    next(error);
  }
};
