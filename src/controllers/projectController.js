const Project = require('../models/Project');
const ErrorResponse = require('../utils/errorResponse'); 
const cache = require('../utils/cache');

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
    const cacheKey = cache.buildKey('project', { id: req.params.id });
    const cached = await cache.get(cacheKey);
    if (cached) {
      // console.log('Cache hit for single project:', cacheKey);
      return res.status(200).json(cached);
    }

    // console.log('Cache miss for single project:', cacheKey);
    const project = await Project.findById(req.params.id).populate('user', 'email');
    if (!project) {
      return next(new ErrorResponse(`Project not found with id of ${req.params.id}`, 404));
    }

    const response = {
      status: 'success',
      data: project,
    };
    // Cache for 30 minutes (1800 seconds)
    cache.set(cacheKey, response, 1800).catch((err) => {
      // console.error('Cache write error for single project:', err);
    });
    res.status(200).json(response);
  } catch (error) {
    next(error);
  }
};
// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Private (Owner/Admin only - enforced by middleware)
exports.createProject = async (req, res, next) => {
  try {
    req.body.user = req.user.id;

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

    await project.deleteOne();

    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(JSON.stringify({ status: 'success', message: 'Project deleted successfully' }));
  } catch (error) {
    next(error);
  }
};