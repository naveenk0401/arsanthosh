const projectService = require("../services/projectService");
const AppError = require("../utils/AppError");

// Wrapper to catch async errors automatically
const catchAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

exports.getAllProjects = catchAsync(async (req, res) => {
    const projects = await projectService.getAllProjects(req.query);
    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
});

exports.getProject = catchAsync(async (req, res) => {
    const project = await projectService.getProjectBySlug(req.params.slug);
    res.status(200).json({
        success: true,
        data: project
    });
});

exports.createProject = catchAsync(async (req, res) => {
    // Note: Assuming authMiddleware handles role checking
    const project = await projectService.createProject(req.body);
    res.status(201).json({
        success: true,
        data: project
    });
});

exports.updateProject = catchAsync(async (req, res) => {
    const project = await projectService.updateProject(req.params.id, req.body);
    res.status(200).json({
        success: true,
        data: project
    });
});

exports.deleteProject = catchAsync(async (req, res) => {
    await projectService.deleteProject(req.params.id);
    res.status(200).json({
        success: true,
        message: "Project deleted successfully"
    });
});
