const projectService = require("../services/projectService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

const getAllProjects = catchAsync(async (req, res) => {
    const projects = await projectService.getAllProjects(req.query);
    return ApiResponse.success(res, 200, projects, "Projects fetched successfully");
});

const getProject = catchAsync(async (req, res) => {
    const project = await projectService.getProjectBySlug(req.params.slug);
    return ApiResponse.success(res, 200, project);
});

const createProject = catchAsync(async (req, res) => {
    const project = await projectService.createProject(req.body);
    return ApiResponse.success(res, 201, project, "Project created successfully");
});

const updateProject = catchAsync(async (req, res) => {
    const project = await projectService.updateProject(req.params.id, req.body);
    return ApiResponse.success(res, 200, project, "Project updated successfully");
});

const deleteProject = catchAsync(async (req, res) => {
    await projectService.deleteProject(req.params.id);
    return ApiResponse.success(res, 200, null, "Project deleted successfully");
});

module.exports = {
    getAllProjects,
    getProject,
    createProject,
    updateProject,
    deleteProject
};
