const ErrorResponse = require('../utils/errorResponse'); 
const errorHandler = (err, req, res, next) => {
  
  let error = { ...err }; 
  error.message = err.message; 

  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new ErrorResponse(message, 404);
  }

 
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map((val) => val.message);
    const message = `Validation error: ${messages.join(', ')}`;
    error = new ErrorResponse(message, 400); 
  }

  if (err.code === 11000) {

    let message = 'Duplicate field value entered';
    
    // Check if it's a duplicate email (most common case)
    if (err.message.includes('email')) {
      message = 'An account with this email address already exists. Please use a different email or try logging in instead.';
    } else if (err.message.includes('username')) {
      message = 'This username is already taken. Please choose a different username.';
    } else {
      // Extract the field name from the error for other cases
      const field = Object.keys(err.keyPattern)[0];
      message = `An account with this ${field} already exists. Please use a different ${field}.`;
    }
    
    error = new ErrorResponse(message, 409); // 409 Conflict

    const field = Object.keys(err.keyValue)[0];
    const value = err.keyValue[field];
    message = `Duplicate field value: ${field} with value '${value}' already exists.`;
    return res.status(409).json({
      status: 'error',
      message: message
    });

  }

  // JWT Errors
  if (err.name === 'JsonWebTokenError') {
    const message = 'Invalid token. Please log in again.';
    error = new ErrorResponse(message, 401);
  }

  if (err.name === 'TokenExpiredError') {
    const message = 'Your session has expired. Please log in again.';
    error = new ErrorResponse(message, 401);
  }
  
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
    // Include helpful suggestions for common errors
    ...(error.statusCode === 409 && { 
      suggestion: 'If you already have an account, try logging in instead of registering.'
    }),
    ...(error.statusCode === 401 && { 
      suggestion: 'Please check your credentials and try again.'
    })
  });
};

module.exports = errorHandler;