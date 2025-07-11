// src/controllers/authController.js
// Why: This controller handles the business logic for user authentication.
// It separates the route definition from the core logic, promoting modularity.

const User = require('../models/User'); // Import the User Mongoose model
const errorHandler = require('../middleware/errorHandler'); // We'll use this for structured errors

// @desc    Register a user
// @route   POST /api/v1/auth/register
// @access  Public
// Why: This is an asynchronous function that handles the registration logic.
// We use a try-catch block for robust error handling.
exports.register = async (req, res, next) => {
  const { email, password } = req.body; // Destructure email and password from the request body

  // Why: Basic validation to ensure both fields are provided.
  // This is the first line of defense against incomplete requests.
  if (!email || !password) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide both email and password',
      suggestion: 'Both email and password are required for registration.'
    });
  }

  // Why: Validate email format
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide a valid email address',
      suggestion: 'Make sure your email is in the correct format (e.g., user@example.com).'
    });
  }

  // Why: Validate password length
  if (password.length < 6) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Password must be at least 6 characters long',
      suggestion: 'Choose a stronger password with at least 6 characters.'
    });
  }

  try {
    // Why: Check if user already exists BEFORE attempting to create
    // This provides immediate, clear feedback instead of waiting for MongoDB error
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({
        status: 'error',
        message: 'An account with this email address already exists.',
        suggestion: 'If this is your account, please try logging in instead of registering.'
      });
    }

    // Why: Check if this is the first user registration (portfolio owner)
    const existingUserCount = await User.countDocuments();
    
    // Why: Create user data with role assignment
    const userData = {
      email: email.toLowerCase(), // Normalize email to lowercase
      password,
      // Why: First user becomes the portfolio owner, subsequent users are viewers
      role: existingUserCount === 0 ? 'owner' : 'viewer'
    };

    // Why: Create a new user document using our Mongoose model.
    // Mongoose will automatically hash the password via our 'pre-save' hook.
    const user = await User.create(userData);

    // Why: Log important role assignments for security auditing
    if (userData.role === 'owner') {
      console.log(`Portfolio owner account created: ${email}`);
    } else {
      console.log(`New viewer account created: ${email}`);
    }

    // Why: Respond with a success message and a token.
    // Sending the token immediately allows the client to log in automatically.
    sendTokenResponse(user, 201, res);
  } catch (error) {
    // Why: If user creation fails (e.g., unexpected database error), we pass the error
    // to our central error handling middleware.
    // The next() call is crucial here.
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  // Why: Basic validation for login credentials.
  if (!email || !password) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide both email and password',
      suggestion: 'Both email and password are required to log in.'
    });
  }

  // Why: Validate email format
  const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      status: 'error', 
      message: 'Please provide a valid email address',
      suggestion: 'Make sure your email is in the correct format (e.g., user@example.com).'
    });
  }

  try {
    // Why: Find the user by email, and explicitly select the password.
    // Remember, we set 'select: false' on the password field in the schema,
    // so we must explicitly ask for it here for comparison.
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

    // Why: Check if the user exists.
    if (!user) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'No account found with this email address',
        suggestion: 'Please check your email or register for a new account.'
      });
    }

    // Why: Use our Mongoose instance method to compare the submitted password
    // with the hashed password in the database.
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ 
        status: 'error', 
        message: 'Incorrect password',
        suggestion: 'Please check your password and try again. If you forgot your password, please contact support.'
      });
    }

    // Why: If credentials are valid, send a token response.
    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get user info with token
// @route   GET /api/v1/auth/me
// @access  Private (we'll implement this access control tomorrow)
exports.getMe = async (req, res, next) => {
  // Why: This route will be protected. Once a token is verified, the user's data
  // will be available on the request object. We'll simply send it back.
  // For now, we'll return a placeholder.
  res.status(200).json({
    status: 'success',
    data: req.user, // The 'req.user' object is available thanks to the 'protect' middleware 
  });
};

// @desc    Update user role (Owner only)
// @route   PUT /api/v1/auth/users/:userId/role
// @access  Private (Owner only)
exports.updateUserRole = async (req, res, next) => {
  const { role } = req.body;
  const { userId } = req.params;

  // Why: Validate the role value
  if (!['owner', 'admin', 'viewer'].includes(role)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid role. Must be owner, admin, or viewer'
    });
  }

  try {
    // Why: Prevent demoting the last owner (system integrity)
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

// Why: A reusable function to create and send a JWT token in the response.
// This prevents code duplication in our register and login functions.
const sendTokenResponse = (user, statusCode, res) => {
  // Why: Call the Mongoose instance method to get the signed token.
  const token = user.getSignedJwtToken();

  // Why: Send the token in the response.
  // In a real app, you might also use cookies for more security.
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