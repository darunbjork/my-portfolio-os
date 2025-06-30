// src/middleware/auth.js
// Why: This is our custom JWT authentication middleware.
// It checks for a token in the request header, verifies its validity,
// and protects routes that should only be accessible to authenticated users.

const jwt = require('jsonwebtoken'); // To verify the token
const User = require('../models/User'); // To find the user by ID from the token payload
const config = require('../config'); // To access our JWT secret
const errorHandler = require('./errorHandler'); // To handle any authentication errors

// Why: This middleware will be used on protected routes.
// It's an async function because it performs a database lookup.
exports.protect = async (req, res, next) => {
  let token;

  // 1. Check for token in the Authorization header
  // Why: This is the standard way to send tokens in a request.
  // The format is "Bearer <token>".
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1]; // Extract the token part
  }

  // 2. Check if token exists
  if (!token) {
    // Why: If no token is provided, the user is not authorized.
    // We send a 401 Unauthorized response with a clear message.
    return res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route, no token provided',
    });
  }

  try {
    // 3. Verify the token
    // Why: jwt.verify() checks if the token is valid, not expired, and signed with our secret.
    const decoded = jwt.verify(token, config.jwtSecret);
    console.log('Decoded JWT payload:', decoded); // For debugging purposes

    // 4. Find the user from the token's payload
    // Why: We get the user's ID from the token's payload (decoded.id) and
    // find the corresponding user in the database.
    // We use .findById() and exclude the password.
    const user = await User.findById(decoded.id).select('-password');

    // Why: Check if the user still exists in the database.
    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    // 5. Attach the user object to the request
    // Why: This is a crucial step! It makes the authenticated user's data
    // available to all subsequent middleware and route handlers.
    req.user = user;

    // Why: Call next() to pass control to the next middleware or route handler in the stack.
    next();
  } catch (error) {
    // Why: If token verification fails (e.g., token is invalid or expired),
    // we catch the error and send a 401 Unauthorized response.
    // We also use next(error) to our centralized handler for logging.
    res.status(401).json({
      status: 'error',
      message: 'Not authorized to access this route, token failed',
    });
    next(error);
  }
};