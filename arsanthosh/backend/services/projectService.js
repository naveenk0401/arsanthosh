const Project = require("../models/Project");
const AppError = require("../utils/AppError");

/**
 * Service to handle Project Business Logic.
 * Manages the portfolio data.
 */
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-+|-+$/g, "");
};

const createProject = async (data) => {
    if (data.title) {
        data.slug = generateSlug(data.title);
    }
    const project = await Project.create(data);
    return project;
};

const getAllProjects = async (query) => {
    const filter = {};
    if (query.category) filter.category = query.category;
    if (query.status) filter.status = query.status;
    if (query.featured) filter.featured = query.featured === 'true';

    return await Project.find(filter)
        .sort("-createdAt")
        .select("-__v");
};

const getProjectBySlug = async (slug) => {
    const project = await Project.findOne({ slug });
    if (!project) throw new AppError("Project not found", 404);
    return project;
};

const updateProject = async (id, data) => {
    if (data.title) {
        data.slug = generateSlug(data.title);
    }
    const project = await Project.findByIdAndUpdate(id, data, {
        new: true,
        runValidators: true
    });
    if (!project) throw new AppError("Project not found", 404);
    return project;
};

const deleteProject = async (id) => {
    const project = await Project.findByIdAndDelete(id);
    if (!project) throw new AppError("Project not found", 404);
    return { message: "Project deleted successfully" };
};

module.exports = {
    createProject,
    getAllProjects,
    getProjectBySlug,
    updateProject,
    deleteProject
};
