// src/controllers/projectController.js
// Why: This controller handles all the CRUD operations for our Project resource.

const Project = require('../models/Project'); // Import the Project Mongoose model

// @desc    Get all projects
// @route   GET /api/v1/projects
// @access  Public
exports.getProjects = async (req, res, next) => {
  try {
    // Why: Use .find() to retrieve all project documents.
    // .populate('user', 'email') loads the 'user' field from the 'User' model
    // and only selects the 'email' field. This avoids sending unnecessary data.
    const projects = await Project.find().populate('user', 'email');

    // Why: Send a 200 OK response with the fetched projects.
    res.status(200).json({
      status: 'success',
      count: projects.length, // Include the count of projects in the response.
      data: projects,
    });
  } catch (error) {
    // Why: Pass any errors to our centralized error handler.
    next(error);
  }
};

// @desc    Get a single project by ID
// @route   GET /api/v1/projects/:id
// @access  Public
exports.getProject = async (req, res, next) => {
  try {
    // Why: Use .findById() to find a single project by its unique ID.
    const project = await Project.findById(req.params.id).populate('user', 'email');

    // Why: If no project is found with that ID, send a 404 Not Found error.
    if (!project) {
      return res.status(404).json({ status: 'error', message: `Project not found with id of ${req.params.id}` });
    }

    res.status(200).json({
      status: 'success',
      data: project,
    });
  } catch (error) {
    // Why: If the ID is not in a valid format (e.g., too short), Mongoose throws an error.
    // We catch it here and pass it to our handler.
    next(error);
  }
};

// @desc    Create a new project
// @route   POST /api/v1/projects
// @access  Private (requires authentication)
exports.createProject = async (req, res, next) => {
  try {
    // Why: We attach the user's ID to the request body before creating the project.
    // This links the new project to the authenticated user's ID from our JWT middleware.
    req.body.user = req.user.id;

    // Why: Create a new project document from the request body.
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
      return res.status(404).json({ status: 'error', message: `Project not found with id of ${req.params.id}` });
    }

    // Why: We implement ownership authorization here.
    // Check if the authenticated user is the owner of the project.
    // We convert both IDs to strings for comparison.
    if (project.user.toString() !== req.user.id) {
      // Why: A 403 Forbidden status indicates the client is authenticated but
      // does not have permission to access the resource.
      return res.status(403).json({ status: 'error', message: 'User is not authorized to update this project' });
    }

    // Why: Use .findByIdAndUpdate() to update the project.
    // 'new: true' returns the modified document instead of the original.
    // 'runValidators: true' ensures our schema validators run on update.
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
      return res.status(404).json({ status: 'error', message: `Project not found with id of ${req.params.id}` });
    }

    // Why: Ownership authorization check again.
    if (project.user.toString() !== req.user.id) {
      return res.status(403).json({ status: 'error', message: 'User is not authorized to delete this project' });
    }

    // Why: Use .deleteOne() for a modern deletion method.
    // Alternative is .remove(), which is older.
    await project.deleteOne();

    // Why: Respond with 204 No Content for a successful deletion.
    res.status(200).json({ status: 'success', message: 'Project deleted successfully' });
  } catch (error) {
    next(error);
  }
};