// src/models/Experience.js
// Why: This schema defines the structure for storing work/project experience.

const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  // Why: 'title' is the job title or role.
  title: {
    type: String,
    required: [true, 'Please provide a title for the experience'],
    trim: true,
  },
  // Why: 'company' is the name of the organization.
  company: {
    type: String,
    required: [true, 'Please provide the company name'],
    trim: true,
  },
  // Why: 'location' can be city, country, or remote.
  location: {
    type: String,
    trim: true,
  },
  // Why: 'from' and 'to' dates.
  from: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  to: {
    type: Date,
    // Why: 'to' is not required, allowing for current jobs.
  },
  // Why: 'current' helps differentiate ongoing roles.
  current: {
    type: Boolean,
    default: false,
  },
  // Why: 'description' outlines responsibilities and achievements.
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  // Why: Link to the owner user.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Experience', ExperienceSchema);