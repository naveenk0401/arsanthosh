const mongoose = require("mongoose");

/**
 * Project Schema
 * Stores architectural portfolio items.
 * Optimized for frequent read operations on the landing page.
 */
const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Project title is required"],
        trim: true,
        maxlength: [100, "Title cannot exceed 100 characters"]
    },
    slug: {
        type: String,
        unique: true,
        lowercase: true,
        index: true // Indexed for faster lookup by slug
    },
    description: {
        type: String,
        required: [true, "Description is required"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Category is required"],
        enum: ["Residential", "Commercial", "Interior", "Landscape", "Renovation"],
        index: true // Indexed for filtering
    },
    images: {
        type: [String], // Array of image URLs
        validate: {
            validator: function (v) {
                return v && v.length > 0;
            },
            message: "A project must have at least one image."
        }
    },
    location: { type: String, trim: true },
    status: {
        type: String,
        enum: ["Completed", "Ongoing", "Concept"],
        default: "Completed"
    },
    featured: { type: Boolean, default: false }, // For highlighting on homepage
    completionDate: { type: Date },
    createdAt: { type: Date, default: Date.now }
}, {
    collection: "ars_projects",
    timestamps: true // Adds createdAt and updatedAt automatically
});

module.exports = mongoose.model("Project", projectSchema);
