// src/middleware/auth.js
// Why: This middleware is responsible for protecting routes that require authentication.
// It verifies the JWT token sent with the request and attaches the user to the request object.

const jwt = require('jsonwebtoken'); // Import the jsonwebtoken library to handle JWT operations
const User = require('../models/User'); // Import the User model to interact with the database
const config = require('../config'); // Import the configuration for JWT secret
const errorHandler = require('./errorHandler'); // Import the error handler middleware

// Why: This asynchronous middleware function will be used to protect routes.
// It checks for a token, verifies it, and then finds the user associated with the token.
exports.protect = async (req, res, next) => {
  let token;

  // Why: Check if the Authorization header exists and starts with 'Bearer'.
  // This is the standard way to send JWTs in HTTP requests.
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    // Why: Extract the token from the 'Bearer <token>' string.
    token = req.headers.authorization.split(' ')[1];
  }

  // Why: If no token is found, or if it's not in the correct format, return an error.
  if (!token) {
    return res.status(401).json({ status: 'error', message: 'Not authorized to access this route, no token provided' });
  }

  try {
    // Why: Verify the token using the JWT_SECRET from our configuration.
    // jwt.verify() decodes the token and checks its signature and expiration.
    const decoded = jwt.verify(token, config.jwtSecret);

    // Why: Find the user by the ID extracted from the token.
    // We don't select the password here for security reasons.
    req.user = await User.findById(decoded.id);

    // Why: If no user is found with that ID, it means the token is invalid or the user no longer exists.
    if (!req.user) {
      return res.status(401).json({ status: 'error', message: 'Not authorized to access this route, not Token' });
    }

    // Why: Call the next middleware in the stack.
    // This passes control to the actual route handler.
    next();
  } catch (error) {
    // Why: If token verification fails (e.g., token is expired or malformed), return an error.
    return res.status(401).json({ status: 'error', message: 'Not authorized to access this route' });
  }
};