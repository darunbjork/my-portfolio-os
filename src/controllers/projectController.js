// src/controllers/projectController.js

const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse'); // Import our custom error class

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  const projects = res.advancedResults.data;

  // Add full URL to image paths
  const projectsWithFullUrls = projects.map(project => {
    const projectObject = project.toObject();
    if (projectObject.image) {
      projectObject.image = `${req.protocol}://${req.get('host')}/uploads/${projectObject.image}`;
    } else {
      projectObject.image = `${req.protocol}://${req.get('host')}/placeholder.jpg`;
    }
    return projectObject;
  });

  res.advancedResults.data = projectsWithFullUrls;

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
// @access  Private (Owner/Admin only - enforced by middleware)
exports.createProject = async (req, res, next) => {
  try {
    // Why: Associate the project with the authenticated user
    req.body.user = req.user.id;

    // If an imageUrl is provided, ensure it's a valid URL
    if (req.body.imageUrl && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(req.body.imageUrl)) {
      return next(new ErrorResponse('Please provide a valid URL for the project image', 400));
    }

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
// @access  Private (Owner/Admin only - enforced by middleware)
exports.updateProject = async (req, res, next) => {
  try {
    // Why: Authorization is now handled by middleware, so we can directly update
    // If an imageUrl is provided, ensure it's a valid URL
    if (req.body.imageUrl && !/^(https?|ftp):\/\/[^\s/$.?#].[^\s]*$/.test(req.body.imageUrl)) {
      return next(new ErrorResponse('Please provide a valid URL for the project image', 400));
    }

    const project = await Project.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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

// @desc    Delete a project by ID
// @route   DELETE /api/v1/projects/:id
// @access  Private (Owner/Admin only - enforced by middleware)
exports.deleteProject = async (req, res, next) => {
  try {
    const project = await Project.findById(req.params.id);

    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    // Why: Authorization is now handled by middleware, so we can directly delete
    await project.deleteOne();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ status: 'success', message: 'Project deleted successfully' }));
  } catch (error) {
    next(error);
  }
};