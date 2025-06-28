// src/db/connect.js
// Why: This module centralizes our database connection logic.
// It keeps the code for connecting to MongoDB separate from our main server logic,
// making it reusable and easier to maintain.

const mongoose = require('mongoose');
const config = require('../config');

const connectDB = async () => {
  try {
    // Why: The connect method is an asynchronous operation, so we use async/await.
    // We pass the MONGO_URI from our configuration.
    const conn = await mongoose.connect(config.mongoURI);

    // Why: Log a success message to the console.
    // This provides crucial feedback during server startup.
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Why: If the connection fails, we log the error and exit the process.
    // A database connection is a critical dependency; if it fails,
    // the server should not continue running.
    console.error(`Error: ${error.message}`);
    process.exit(1); // Exit with a failure code (1)
  }
};

module.exports = connectDB;