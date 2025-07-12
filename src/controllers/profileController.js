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
      // Return an empty array so the frontend can handle it gracefully
      return res.status(200).json({ success: true, data: [] });
    }

    // If profile found, return it as an array (as frontend expects)
    res.status(200).json({ success: true, data: [profile] });

  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create user profile
// @route   POST /api/v1/profile
// @access  Private
exports.createProfile = async (req, res, next) => {
  try {
    console.log('createProfile: Received request.');
    console.log('createProfile: req.user:', req.user);
    console.log('createProfile: req.body:', req.body);

    // Check if profile already exists for this user
    let profile = await Profile.findOne({ user: req.user.id });

    if (profile) {
      console.log('createProfile: Profile already exists.');
      return next(new ErrorResponse('Profile already exists for this user. Use PUT to update.', 400));
    }

    // Add user to req.body
    req.body.user = req.user.id;
    console.log('createProfile: req.body after adding user:', req.body);

    profile = await Profile.create(req.body);
    console.log('createProfile: Profile created successfully.');

    res.status(201).json({
      success: true,
      data: profile
    });
  } catch (error) {
    console.error('createProfile: Error caught:', error.message);
    console.error('createProfile: Error details:', error);
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
