// src/middleware/errorHandler.js
// Why: Centralized error handling. This middleware ensures that all errors
// in our application are caught and handled gracefully, sending a consistent
// error response to the client and preventing sensitive information leaks.

const errorHandler = (err, req, res, next) => {
  console.error(err); // Log the error for debugging purposes

  // Determine the status code based on the error
  // If the error has a 'statusCode' property, use it; otherwise, default to 500 (Internal Server Error)
  const statusCode = err.statusCode || 500;

  // Create a response object
  const response = {
    status: 'error',
    message: err.message || 'An unexpected error occurred',
  };

  // In production, avoid sending detailed error messages to clients for security reasons.
  // We're keeping it simple for now, but will enhance this later.
  if (process.env.NODE_ENV === 'production' && statusCode === 500) {
    response.message = 'Internal Server Error';
  }

  // Send the error response
  res.status(statusCode).json(response);
};

module.exports = errorHandler;