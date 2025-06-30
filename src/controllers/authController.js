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
    return res.status(400).json({ status: 'error', message: 'Please provide both email and password' });
  }

  try {
    // Why: Create a new user document using our Mongoose model.
    // Mongoose will automatically hash the password via our 'pre-save' hook.
    const user = await User.create({ email, password });

    // Why: Respond with a success message and a token.
    // Sending the token immediately allows the client to log in automatically.
    sendTokenResponse(user, 201, res);
  } catch (error) {
    // Why: If user creation fails (e.g., email is not unique), we pass the error
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
    return res.status(400).json({ status: 'error', message: 'Please provide both email and password' });
  }

  try {
    // Why: Find the user by email, and explicitly select the password.
    // Remember, we set 'select: false' on the password field in the schema,
    // so we must explicitly ask for it here for comparison.
    const user = await User.findOne({ email }).select('+password');

    // Why: Check if the user exists.
    if (!user) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
    }

    // Why: Use our Mongoose instance method to compare the submitted password
    // with the hashed password in the database.
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ status: 'error', message: 'Invalid credentials' });
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
  });
};