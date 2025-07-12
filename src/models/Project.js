// src/models/Project.js
// Why: This file defines the Mongoose schema and model for our 'Project' resource.
// It enforces a structured representation of our portfolio projects in the database.

const mongoose = require('mongoose');

// Define the Project schema
const ProjectSchema = new mongoose.Schema({
  // Why: 'title' is a required string.
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true, // Why: 'trim' removes leading/trailing whitespace.
    maxlength: [100, 'Title cannot be more than 100 characters'],
  },
  // Why: 'description' is a required string for project details.
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
    maxlength: [2000, 'Description cannot be more than 2000 characters'],
  },
  // Why: 'technologies' is an array of strings, useful for filtering.
  technologies: {
    type: [String],
    required: [true, 'Please list the technologies used'],
  },
  // Why: 'githubUrl' stores the link to the project's GitHub repository.
  githubUrl: {
    type: String,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      'Please use a valid URL for the GitHub link',
    ],
  },
  // Why: 'liveUrl' stores the link to the live demo of the project.
  liveUrl: {
    type: String,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      'Please use a valid URL for the live demo link',
    ],
  },
  // Why: This is a crucial relationship field! It links a project to its owner (the user).
  // 'ref: "User"' tells Mongoose that this is a reference to the 'User' model.
  // This allows us to populate the user data when querying projects.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // Why: 'imageUrl' stores the URL of the project's image.
  imageUrl: {
    type: String,
    match: [
      /^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/,
      'Please use a valid URL for the project image',
    ],
  },
  // Why: 'createdAt' is automatically added for tracking.
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Why: Export the Mongoose model so we can use it in our controllers.
module.exports = mongoose.model('Project', ProjectSchema);