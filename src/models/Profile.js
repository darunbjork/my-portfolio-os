const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true // Each user can only have one profile
  },
  fullName: {
    type: String,
    required: [true, 'Please provide your full name'],
    trim: true
  },
  title: {
    type: String,
    required: [true, 'Please provide your professional title'],
    trim: true
  },
  summary: {
    type: String,
    required: [true, 'Please provide a professional summary'],
    maxlength: [500, 'Summary cannot be more than 500 characters']
  },
  bio: {
    type: String,
    maxlength: [2000, 'Bio cannot be more than 2000 characters']
  },
  location: {
    type: String,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Please provide an email address for your profile'],
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please enter a valid email address'
    ]
  },
  website: {
    type: String,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      'Please enter a valid URL for your website'
    ]
  },
  linkedinUrl: {
    type: String,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      'Please enter a valid URL for your LinkedIn profile'
    ]
  },
  githubUrl: {
    type: String,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      'Please enter a valid URL for your GitHub profile'
    ]
  },
  profileImageUrl: {
    type: String,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      'Please enter a valid URL for your profile image'
    ]
  },
  resumeUrl: {
    type: String,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      'Please enter a valid URL for your resume'
    ]
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', ProfileSchema);