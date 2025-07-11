// src/api/info.js
// Why: This router groups routes for Skills and Experience, keeping the server file clean.

const express = require('express');
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/infoController');
const { protect, requireOwnerOrAdmin } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');

const router = express.Router();

// --- Skills Routes ---
router.route('/skills')
  .get(advancedResults(Skill), getSkills) // Public read access
  .post(protect, requireOwnerOrAdmin, createSkill); // Only owner/admin can create skills

router.route('/skills/:id')
  .get(getSkill)
  .put(protect, requireOwnerOrAdmin, updateSkill)   // Only owner/admin can update skills
  .delete(protect, requireOwnerOrAdmin, deleteSkill); // Only owner/admin can delete skills

// --- Experience Routes ---
router.route('/experience')
  .get(advancedResults(Experience), getExperiences) // Public read access
  .post(protect, requireOwnerOrAdmin, createExperience); // Only owner/admin can create experience

router.route('/experience/:id')
  .put(protect, requireOwnerOrAdmin, updateExperience)   // Only owner/admin can update experience
  .delete(protect, requireOwnerOrAdmin, deleteExperience); // Only owner/admin can delete experience

module.exports = router;