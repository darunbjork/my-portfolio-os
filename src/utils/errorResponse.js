// src/utils/errorResponse.js
// Why: This is a custom error class that extends the built-in Error object.
// It allows us to create structured error objects with a custom message and status code.

class ErrorResponse extends Error {
  constructor(message, statusCode) {
    // Why: Call the parent Error class constructor with the message.
    super(message);
    // Why: Add a custom property 'statusCode' to the error object.
    this.statusCode = statusCode;
  }
}

module.exports = ErrorResponse;