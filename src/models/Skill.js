// src/models/Skill.js
// Why: This schema defines the structure for storing skills in the database.

const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  // Why: 'name' is the name of the skill (e.g., 'JavaScript', 'React').
  name: {
    type: String,
    required: [true, 'Please provide a skill name'],
    unique: true, // Why: Ensures no duplicate skill names.
    trim: true,
  },
  // Why: 'proficiency' can be used to rate your skill level (e.g., 'Advanced', 'Intermediate').
  proficiency: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', 'Expert'], // Why: Restricts the value to a predefined list.
    default: 'Intermediate',
  },
  // Why: 'category' groups skills (e.g., 'Frontend', 'Backend').
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Tools'],
    required: [true, 'Please provide a skill category'],
  },
  // Why: This links a skill to its owner, similar to the Project model.
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

module.exports = mongoose.model('Skill', SkillSchema);