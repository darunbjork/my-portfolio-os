const LearningItem = require('../models/LearningItem');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all learning items
// @route   GET /api/v1/learning
// @access  Public
exports.getLearningItems = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Get a single learning item by ID
// @route   GET /api/v1/learning/:id
// @access  Public
exports.getLearningItem = async (req, res, next) => {
  try {
    const learningItem = await LearningItem.findById(req.params.id).populate('user', 'email');

    if (!learningItem) {
      return next(new ErrorResponse(`Learning item not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: learningItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new learning item
// @route   POST /api/v1/learning
// @access  Private (Owner/Admin only - enforced by middleware)
exports.createLearningItem = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const learningItem = await LearningItem.create(req.body);

    res.status(201).json({
      status: 'success',
      data: learningItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a learning item by ID
// @route   PUT /api/v1/learning/:id
// @access  Private (Owner/Admin only - enforced by middleware)
exports.updateLearningItem = async (req, res, next) => {
  try {
    const learningItem = await LearningItem.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!learningItem) {
      return next(new ErrorResponse(`Learning item not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: learningItem,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a learning item by ID
// @route   DELETE /api/v1/learning/:id
// @access  Private (Owner/Admin only - enforced by middleware)
exports.deleteLearningItem = async (req, res, next) => {
  try {
    const learningItem = await LearningItem.findById(req.params.id);

    if (!learningItem) {
      return next(new ErrorResponse(`Learning item not found with id of ${req.params.id}`, 404));
    }

    await learningItem.deleteOne();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ status: 'success', message: 'Learning item deleted successfully' }));
  } catch (error) {
    next(error);
  }
};
