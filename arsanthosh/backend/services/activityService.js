const Activity = require("../models/Activity");

const logActivity = async (type, message, metadata = {}) => {
    try {
        await Activity.create({
            type,
            message,
            adminId: metadata.adminId || null,
            targetTab: metadata.targetTab || "overview",
            targetId: metadata.targetId || null
        });
    } catch (err) {
        console.error("Failed to log activity:", err);
        // Non-blocking, we don't want to crash the main request
    }
};

const getRecentActivities = async (limit = 10) => {
    return await Activity.find()
        .sort("-createdAt")
        .limit(limit)
        .populate("adminId", "name");
};

module.exports = {
    logActivity,
    getRecentActivities
};
