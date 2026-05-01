const User = require('../models/User'); 
const errorHandler = require('../middleware/errorHandler'); 
const ErrorResponse = require('../utils/errorResponse');
const crypto = require('crypto');
const sendEmail = require('../utils/sendEmail');

// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  Public
// Why: This is an asynchronous function that handles the registration logic.
// We use a try-catch block for robust error handling.
exports.register = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide both email and password',
      suggestion: 'Both email and password are required for registration.'
    });
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide a valid email address',
      suggestion: 'Make sure your email is in the correct format (e.g., user@example.com).'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Password must be at least 6 characters long',
      suggestion: 'Choose a stronger password with at least 6 characters.'
    });
  }

  try {
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email address already exists.',
        suggestion: 'If this is your account, please try logging in instead of registering.'
      });
    }

    const existingUserCount = await User.countDocuments();
    
    const userData = {
      email: email.toLowerCase(), 
      password,
      role: existingUserCount === 0 ? 'owner' : 'viewer'
    };

    const user = await User.create(userData);

    if (userData.role === 'owner') {
      console.log(`Portfolio owner account created: ${email}`);
    } else {
      console.log(`New viewer account created: ${email}`);
    }

    sendTokenResponse(user, 201, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide both email and password',
      suggestion: 'Both email and password are required to log in.'
    });
  }

  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide a valid email address',
      suggestion: 'Make sure your email is in the correct format (e.g., user@example.com).'
    });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    if (!user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'No account found with this email address',
        suggestion: 'Please check your email or register for a new account.'
      });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Incorrect password',
        suggestion: 'Please check your password and try again. If you forgot your password, please contact support.'
      });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user info with token
// @route   GET /api/v1/auth/me
// @access  Private (we'll implement this access control tomorrow)
exports.getMe = async (req, res, next) => {
  res.status(200).json({
    status: 'success',
    data: req.user, 
  });
};

// @desc    Update user role (Owner only)
// @route   PUT /api/v1/auth/users/:userId/role
// @access  Private (Owner only)
exports.updateUserRole = async (req, res, next) => {
  const { role } = req.body;
  const { userId } = req.params;

  if (!['owner', 'admin', 'viewer'].includes(role)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid role. Must be owner, admin, or viewer'
    });
  }

  try {
    if (role !== 'owner') {
      const ownerCount = await User.countDocuments({ role: 'owner' });
      const targetUser = await User.findById(userId);
      
      if (ownerCount === 1 && targetUser && targetUser.role === 'owner') {
        return res.status(400).json({
          status: 'error',
          message: 'Cannot change the role of the last remaining owner'
        });
      }
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found'
      });
    }

    console.log(`User role updated: ${user.email} -> ${role} (by: ${req.user.email})`);

    res.status(200).json({
      status: 'success',
      data: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all users (Owner only)
// @route   GET /api/v1/auth/users
// @access  Private (Owner only)
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find().select('-password').sort('createdAt');
    
    res.status(200).json({
      status: 'success',
      count: users.length,
      data: users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Please provide current and new passwords',
    });
  }

  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({
        status: 'error',
        message: 'Incorrect current password',
      });
    }

    user.password = newPassword;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgotpassword
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  if (!process.env.FRONTEND_URL) {
    return next(new ErrorResponse('FRONTEND_URL is not set in .env file', 500));
  }

  const { email } = req.body;

  if (!email) {
    return next(new ErrorResponse('Please provide an email address', 400));
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return next(new ErrorResponse('There is no user with that email', 404));
    }

    const resetToken = user.getResetPasswordToken();

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please click on the following link to reset your password: <br><br> <a href="${resetUrl}">${resetUrl}</a>`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message,
      });

      res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return next(new ErrorResponse('Email could not be sent', 500));
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/resetpassword/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  // Get hashed token
  const resetPasswordToken = crypto
    .createHash('sha256')
    .update(req.params.resettoken)
    .digest('hex');

  try {
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return next(new ErrorResponse('Invalid token', 400));
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};


const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();
  res.status(statusCode).json({
    status: 'success',
    token,
    user: {
      id: user._id,
      email: user.email,
      role: user.role
    }
  });
};