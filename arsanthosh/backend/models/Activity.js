const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
    type: {
        type: String,
        required: true,
        enum: ["INQUIRY", "PRODUCT", "PAYMENT", "STAFF", "SYSTEM"]
    },
    message: {
        type: String,
        required: true
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    targetTab: {
        type: String, // e.g., "inquiries", "products", "payments", "staff"
        default: "overview"
    },
    targetId: {
        type: String // Optional: Specific ID to highlight or open
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    collection: "ars_activities"
});

module.exports = mongoose.model("Activity", activitySchema);
