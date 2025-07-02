// src/api/info.js
// Why: This router groups routes for Skills and Experience, keeping the server file clean.

const express = require('express');
const {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/infoController');
const { protect } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');

const router = express.Router();

// --- Skills Routes ---
router.route('/skills')
  .get(advancedResults(Skill), getSkills) // Public read access
  .post(protect, createSkill);             // Private write access

router.route('/skills/:id')
  .put(protect, updateSkill)
  .delete(protect, deleteSkill);

// --- Experience Routes ---
router.route('/experience')
  .get(advancedResults(Experience), getExperiences) // Public read access
  .post(protect, createExperience);                  // Private write access

router.route('/experience/:id')
  .put(protect, updateExperience)
  .delete(protect, deleteExperience);

module.exports = router;