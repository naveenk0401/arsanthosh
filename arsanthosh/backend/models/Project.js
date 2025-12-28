const mongoose = require("mongoose");

/**
 * Project Schema
 * Stores architectural portfolio items.
 * Optimized for frequent read operations on the landing page.
 */
const projectSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Project title is required"],
      trim: true,
      maxlength: [100, "Title cannot exceed 100 characters"],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      index: true, // Indexed for faster lookup by slug
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: [
        "Residential Architecture",
        "Commercial Architecture",
        "Interior Design",
        "Landscape Design",
        "Renovation",
      ],
      index: true, // Indexed for filtering
    },
    images: {
      type: [String], // Array of image URLs
      validate: {
        validator: function (v) {
          return v && v.length >= 4 && v.length <= 10;
        },
        message: "A project must have between 4 and 10 images.",
      },
    },
    location: { type: String, trim: true },
    status: {
      type: String,
      enum: ["Completed", "Ongoing", "Concept"],
      default: "Completed",
    },
    // New Detailed Fields
    process: [
      {
        title: { type: String, required: true },
        description: { type: String, required: true },
      },
    ],
    budgetDetails: { type: String, trim: true }, // e.g., "Completed within ₹50L budget"
    timeline: { type: String, trim: true }, // e.g., "8 Months"
    materials: [{ type: String }], // e.g., ["Teak Wood", "Italian Marble"]
    clientTestimonial: {
      name: { type: String },
      role: { type: String }, // e.g., "Homeowner"
      comment: { type: String },
      rating: { type: Number, min: 1, max: 5 },
    },
    whyChooseUs: { type: String, trim: true }, // Unique selling point for this project

    featured: { type: Boolean, default: false }, // For highlighting on homepage
    completionDate: { type: Date },
    createdAt: { type: Date, default: Date.now },
  },
  {
    collection: "ars_projects",
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

projectSchema.index({ createdAt: -1 });

module.exports = mongoose.model("Project", projectSchema);
