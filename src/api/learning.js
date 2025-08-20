const express = require('express');
const {
  getLearningItems,
  getLearningItem,
  createLearningItem,
  updateLearningItem,
  deleteLearningItem,
} = require('../controllers/learningController');
const { protect, requireOwnerOrAdmin } = require('../middleware/auth');
const advancedResults = require('../middleware/advancedResults');
const LearningItem = require('../models/LearningItem');

const router = express.Router();

router.route('/')
  .get(advancedResults(LearningItem, { path: 'user', select: 'email' }), getLearningItems)
  .post(protect, requireOwnerOrAdmin, createLearningItem);

router.route('/:id')
  .get(getLearningItem)
  .put(protect, requireOwnerOrAdmin, updateLearningItem)
  .delete(protect, requireOwnerOrAdmin, deleteLearningItem);

module.exports = router;
