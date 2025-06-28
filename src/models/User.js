// src/models/User.js
// Why: This file defines the Mongoose schema and model for our 'User' resource.
// It enforces a consistent structure for user data in our database.

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs'); // For password hashing
const jwt = require('jsonwebtoken'); // For creating JWTs
const config = require('../config'); // To access our JWT secret

// Define the User schema
const UserSchema = new mongoose.Schema({
  // Why: The 'email' field is required and must be unique.
  // It is also indexed for faster queries.
  email: {
    type: String,
    required: [true, 'Please provide a valid email address'],
    unique: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email',
    ],
  },
  // Why: The 'password' field is required and stored as a hashed string.
  // We NEVER store plain-text passwords.
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Why: 'select: false' ensures the password field is not returned by default
                   // in query results. This is a security best practice.
  },
  // Why: createdAt and updatedAt fields are automatically managed by Mongoose.
  // They are useful for auditing and tracking record lifecycles.
}, { timestamps: true });

// --- Mongoose Middleware (Pre-save hook) ---
// Why: We use a 'pre-save' hook to hash the password BEFORE it's saved to the database.
// This ensures the password is always hashed when it's created or updated.
UserSchema.pre('save', async function (next) {
  // Why: Only hash the password if it's being modified.
  // This prevents re-hashing an already hashed password on subsequent saves.
  if (!this.isModified('password')) {
    return next();
  }
  // Why: Use bcrypt.genSalt() to generate a random salt.
  // A salt is random data that is added to the password before hashing.
  // This prevents rainbow table attacks.
  const salt = await bcrypt.genSalt(10);
  // Why: Hash the password with the generated salt.
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// --- Instance Methods ---
// Why: These are methods available on individual document instances.
// They encapsulate business logic related to the User model.

// Method to compare candidate password with the hashed password
UserSchema.methods.comparePassword = async function (candidatePassword) {
  // Why: bcrypt.compare() is a cryptographic comparison that prevents timing attacks.
  // It takes the plain-text password and compares it to the hashed password.
  const isMatch = await bcrypt.compare(candidatePassword, this.password);
  return isMatch;
};

// Method to generate a JWT token
UserSchema.methods.getSignedJwtToken = function () {
  // Why: jwt.sign() creates a new token. We pass the user's ID as the payload.
  // The token is signed using our JWT_SECRET and expires after a set time.
  return jwt.sign({ id: this._id }, config.jwtSecret, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);