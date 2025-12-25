const Project = require("../models/Project");
const AppError = require("../utils/AppError");

/**
 * Service to handle Project Business Logic.
 * Manages the portfolio data.
 */
class ProjectService {
    /**
     * Creates a new project in the portfolio.
     */
    async createProject(data) {
        // Future optimization: Add image upload handling (S3/Cloudinary) here if not handled by frontend
        const project = await Project.create(data);
        return project;
    }

    /**
     * Retrieves all projects, optionally filtered by category.
     * Optimized to return only necessary fields for listing (lean).
     */
    async getAllProjects(query) {
        const filter = {};
        if (query.category) filter.category = query.category;
        if (query.status) filter.status = query.status;
        if (query.featured) filter.featured = query.featured === 'true';

        return await Project.find(filter)
            .sort("-createdAt") // Newest first
            .select("-__v"); // Exclude internal version key
    }

    /**
     * Retrieves a single project by its slug (SEO friendly).
     */
    async getProjectBySlug(slug) {
        const project = await Project.findOne({ slug });
        if (!project) throw new AppError("Project not found", 404);
        return project;
    }

    /**
     * Updates an existing project.
     */
    async updateProject(id, data) {
        const project = await Project.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true
        });
        if (!project) throw new AppError("Project not found", 404);
        return project;
    }

    /**
     * Deletes a project.
     */
    async deleteProject(id) {
        const project = await Project.findByIdAndDelete(id);
        if (!project) throw new AppError("Project not found", 404);
        return { message: "Project deleted successfully" };
    }
}

module.exports = new ProjectService();
