// src/config/index.js
// Why: This file centralizes our application's configuration.
// It reads values from environment variables, providing defaults if they're not set.
// This is crucial for different environments (development, production).

require('dotenv').config(); // Load environment variables from .env file

const config = {
  port: process.env.PORT || 3000, // Our server's port, default to 3000
  env: process.env.NODE_ENV || 'development', // Application environment (development, production, etc.)
  // Add other configurations here as we build out the app
};

module.exports = config; // Export the config object so other files can use it