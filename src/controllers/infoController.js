// src/controllers/infoController.js
// Why: This controller handles CRUD for both Skills and Experience.
// We are following the DRY principle (Don't Repeat Yourself) by reusing code.

const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const ErrorResponse = require('../utils/errorResponse');

// --- Skills CRUD Operations ---

// @desc    Get all skills
// @route   GET /api/v1/skills
// @access  Public
exports.getSkills = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Create a new skill
// @route   POST /api/v1/skills
// @access  Private
exports.createSkill = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const skill = await Skill.create(req.body);
    res.status(201).json({ status: 'success', data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a skill by ID
// @route   PUT /api/v1/skills/:id
// @access  Private (requires ownership)
exports.updateSkill = async (req, res, next) => {
  try {
    let skill = await Skill.findById(req.params.id);
    if (!skill) return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    if (skill.user.toString() !== req.user.id) return next(new ErrorResponse('User is not authorized to update this skill', 403));

    skill = await Skill.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: skill });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a skill by ID
// @route   DELETE /api/v1/skills/:id
// @access  Private (requires ownership)
exports.deleteSkill = async (req, res, next) => {
  try {
    const skill = await Skill.findById(req.params.id);
    if (!skill) return next(new ErrorResponse(`Skill not found with id of ${req.params.id}`, 404));
    if (skill.user.toString() !== req.user.id) return next(new ErrorResponse('User is not authorized to delete this skill', 403));
    await skill.deleteOne();
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

// @desc    Create a new experience
// @route   POST /api/v1/experience
// @access  Private
exports.createExperience = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const experience = await Experience.create(req.body);
    res.status(201).json({ status: 'success', data: experience });
  } catch (error) {
    next(error);
  }
};

// @desc    Update an experience by ID
// @route   PUT /api/v1/experience/:id
// @access  Private (requires ownership)
exports.updateExperience = async (req, res, next) => {
  try {
    let experience = await Experience.findById(req.params.id);
    if (!experience) return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
    if (experience.user.toString() !== req.user.id) return next(new ErrorResponse('User is not authorized to update this experience', 403));

    experience = await Experience.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    res.status(200).json({ status: 'success', data: experience });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete an experience by ID
// @route   DELETE /api/v1/experience/:id
// @access  Private (requires ownership)
exports.deleteExperience = async (req, res, next) => {
  try {
    const experience = await Experience.findById(req.params.id);
    if (!experience) return next(new ErrorResponse(`Experience not found with id of ${req.params.id}`, 404));
    if (experience.user.toString() !== req.user.id) return next(new ErrorResponse('User is not authorized to delete this experience', 403));
    await experience.deleteOne();
    res.status(204).json({ status: 'success', data: null });
  } catch (error) {
    next(error);
  }
};