const mongoose = require('mongoose');

const ExperienceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a title for the experience'],
    trim: true,
  },
  company: {
    type: String,
    required: [true, 'Please provide the company name'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
  from: {
    type: Date,
    required: [true, 'Please provide a start date'],
  },
  to: {
    type: Date,
  },
  current: {
    type: Boolean,
    default: false,
  },
  description: {
    type: String,
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
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