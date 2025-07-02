// src/controllers/projectController.js

const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse'); // Import our custom error class

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  res.status(200).json(res.advancedResults);
};

// @desc    Get a single project by ID
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id).populate('user', 'email');

    // Why: Use our new custom error class for 'not found' scenarios.
    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Private (requires authentication)
exports.createProject = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

    const project = await Project.create(req.body);

    res.status(201).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a project by ID
// @route   PUT /api/v1/projects/:id
// @access  Private (requires authentication & ownership)
exports.updateProject = async (req, res, next) => {
  try {
    let project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    if (project.user.toString() !== req.user.id) {
      return next(new ErrorResponse('User is not authorized to update this project', 403));
    }

    project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a project by ID
// @route   DELETE /api/v1/projects/:id
// @access  Private (requires authentication & ownership)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    if (project.user.toString() !== req.user.id) {
      return next(new ErrorResponse('User is not authorized to delete this project', 403));
    }

    await project.deleteOne();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ status: 'success', message: 'Project deleted successfully' }));
  } catch (error) {
    next(error);
  }
};