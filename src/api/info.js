const express = require('express');
const {
  getSkills,
  getSkill,
  createSkill,
  updateSkill,
  deleteSkill,
  getExperiences,
  getExperience,
  createExperience,
  updateExperience,
  deleteExperience,
} = require('../controllers/infoController');
const { protect, requireOwnerOrAdmin } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');

const router = express.Router();

router.route('/skills')
  .get(advancedResults(Skill), getSkills) 
  .post(protect, requireOwnerOrAdmin, createSkill); 

router.route('/skills/:id')
  .get(getSkill)
  .put(protect, requireOwnerOrAdmin, updateSkill)  
  .delete(protect, requireOwnerOrAdmin, deleteSkill); 

router.route('/experience')
  .get(advancedResults(Experience), getExperiences) 
  .post(protect, requireOwnerOrAdmin, createExperience); 

router.route('/experience/:id')
  .get(getExperience)
  .put(protect, requireOwnerOrAdmin, updateExperience)  
  .delete(protect, requireOwnerOrAdmin, deleteExperience);

module.exports = router;