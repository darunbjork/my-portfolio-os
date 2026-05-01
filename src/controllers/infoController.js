const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const ErrorResponse = require('../utils/errorResponse');
const cache = require('../utils/cache');

// --- Skills CRUD Operations ---

// @desc    Get all skills
// @route   GET /api/v1/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Get single skill
// @route   GET /api/v1/skills/:id
// @access  Public
exports.getSkill = async (req, res, next) => {
  try {
    const cacheKey = cache.buildKey('skill', { id: req.params.id });
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }

    const response = {
      status: 'success',
      data: skill,
    };
    cache.set(cacheKey, response, 1800);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new skill
// @route   POST /api/v1/skills
// @access  Private (Owner/Admin only - enforced by middleware)
exports.createSkill = async (req, res, next) => {
  try {
    console.log('Inside createSkill function');
    console.log('req.user:', req.user);
    if (req.user && req.user.id) {
      req.body.user = req.user.id;
      console.log('req.body.user set to:', req.body.user);
    } else {
      console.log('req.user or req.user.id is undefined.');
      return next(new ErrorResponse('Not authorized to create skill: User not found or ID missing', 401));
    }
    const skill = await Skill.create(req.body);
    await cache.delByPattern('skill*'); 
    res.status(201).json({ status: 'success', data: skill });
  } catch (error) {
    console.error('Error in createSkill:', error.message);
    next(error);
  }
};

// @desc    Update a skill by ID
// @route   PUT /api/v1/skills/:id
// @access  Private (Owner/Admin only - enforced by middleware)
exports.updateSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }

    await cache.delByPattern('skill*'); 
    res.status(200).json({ status: 'success', data: skill });  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill by ID
// @route   DELETE /api/v1/skills/:id
// @access  Private (Owner/Admin only - enforced by middleware)
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
      return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    }

    // Why: Authorization is now handled by middleware, so we can directly delete
    await skill.deleteOne();
    await cache.delByPattern('skill*');
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};

// --- Experience CRUD Operations ---

// @desc    Get all experiences
// @route   GET /api/v1/experience
// @access  Public
exports.getExperiences = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Get single experience
// @route   GET /api/v1/experience/:id
// @access  Public
exports.getExperience = async (req, res, next) => {
  try {
    const cacheKey = cache.buildKey('experience', { id: req.params.id });
    const cached = await cache.get(cacheKey);
    if (cached) {
      return res.status(200).json(cached);
    }

    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
    }

    const response = {
      status: 'success',
      data: experience,
    };
    cache.set(cacheKey, response, 1800);
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new experience
// @route   POST /api/v1/experience
// @access  Private (Owner/Admin only - enforced by middleware)
exports.createExperience = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const experience = await Experience.create(req.body);
    await cache.delByPattern('experience*'); 
    res.status(201).json({ status: 'success', data: experience });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an experience by ID
// @route   PUT /api/v1/experience/:id
// @access  Private (Owner/Admin only - enforced by middleware)
exports.updateExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!experience) {
      return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
    }

    await cache.delByPattern('experience*'); 
    res.status(200).json({ status: 'success', data: experience });  } catch (error) {
    next(error);
  }
};

// @desc    Delete an experience by ID
// @route   DELETE /api/v1/experience/:id
// @access  Private (Owner/Admin only - enforced by middleware)
exports.deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);

    if (!experience) {
      return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
    }

    await experience.deleteOne();
    await cache.delByPattern('experience*');
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};