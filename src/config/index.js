// src/config/index.js
// Why: This file centralizes our application's configuration.
// It reads values from environment variables, providing defaults if they're not set.
// This is crucial for different environments (development, production).
// Why: Centralized configuration with environment variable fallbacks.

require('dotenv').config();

const config = {
  port: process.env.PORT || 3000,
  env: process.env.NODE_ENV || 'development',
  mongoURI: process.env.MONGO_URI, // Added for MongoDB connection
  jwtSecret: process.env.JWT_SECRET, // Added for JWT signing
};

// Why: We'll add a simple validation check to ensure critical variables are set.
if (!config.mongoURI) {
  console.error("FATAL ERROR: MONGO_URI is not defined.");
  // We'll add a check to exit the process here later for a more robust setup
  // but for now, we just log it.
}
if (!config.jwtSecret) {
  console.error("FATAL ERROR: JWT_SECRET is not defined.");
}

module.exports = config;