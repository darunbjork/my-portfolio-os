// src/middleware/errorHandler.js
// Why: This is our central error handling middleware.
// It catches errors from all routes and sends a structured, consistent JSON response.

const ErrorResponse = require('../utils/errorResponse'); // Import our custom error class

const errorHandler = (err, req, res, next) => {
  let error = { ...err }; // Copy the error object
  error.message = err.message; // Preserve the original error message

  // Why: Log the error to the console for debugging.
  console.error('Caught an error:', err.stack);

  // Mongoose Bad ObjectId Error (e.g., GET /projects/12345)
  // Why: Check for a CastError from Mongoose, which happens when an ID format is invalid.
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    // Why: Create a new custom error instance for this specific Mongoose error.
    error = new ErrorResponse(message, 404);
  }

  // Mongoose Validation Error (e.g., creating a project with no title)
  // Why: Check for Mongoose validation errors.
  if (err.name === 'ValidationError') {
    // Why: Map over the error details to extract validation messages.
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = `Validation error: ${messages.join(', ')}`;
    error = new ErrorResponse(message, 400); // 400 Bad Request
  }

  // Mongoose Duplicate Key Error (e.g., registering with an existing email)  // Why: Check for MongoDB duplicate key errors (code 11000).  if (err.code === 11000) {    const field = Object.keys(err.keyValue)[0];    const value = err.keyValue[field];    const message = `Duplicate field value: ${field} with value '${value}' already exists.`;    error = new ErrorResponse(message, 409); // 409 Conflict  }
  
  // Handle custom ErrorResponse instances
  // Why: If the error is an instance of our custom class, use its statusCode.
  if (err instanceof ErrorResponse) {
    error.statusCode = err.statusCode;
    error.message = err.message;
  }

  // Why: Send the final structured JSON response.
  // We use the status code from our custom error or default to 500.
  res.status(error.statusCode || 500).json({
    status: 'error',
    message: error.message || 'Server Error',
  });
};

module.exports = errorHandler;