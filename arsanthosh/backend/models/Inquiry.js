const mongoose = require("mongoose");

/**
 * Inquiry Schema
 * Stores contact form submissions from the landing page.
 */
const inquirySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            "Please provide a valid email address"
        ]
    },
    phone: {
        type: String,
        trim: true
    },
    serviceType: {
        type: String,
        enum: ["Architectural Design", "Interior Design", "Consultation", "Construction", "Other"],
        default: "Other"
    },
    message: {
        type: String,
        required: [true, "Message is required"],
        maxlength: [1000, "Message cannot exceed 1000 characters"]
    },
    status: {
        type: String,
        enum: ["New", "Contacted", "Closed", "Spam"],
        default: "New",
        index: true // Indexed for admin dashboard filtering
    },
    adminNotes: { type: String }, // For internal use
    createdAt: { type: Date, default: Date.now }
}, {
    collection: "ars_inquiries",
    timestamps: true
});

inquirySchema.index({ createdAt: -1 });

module.exports = mongoose.model("Inquiry", inquirySchema);
