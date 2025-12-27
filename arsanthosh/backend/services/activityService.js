const Activity = require("../models/Activity");

class ActivityService {
    /**
     * Logs a new activity to the database.
     * @param {string} type - INQUIRY, PRODUCT, PAYMENT, STAFF, SYSTEM
     * @param {string} message - Descriptive message of the activity
     * @param {Object} metadata - Optional metadata (adminId, targetTab, targetId)
     */
    async logActivity(type, message, metadata = {}) {
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
    }

    /**
     * Retrieves recent activities.
     * @param {number} limit - Number of activities to fetch
     */
    async getRecentActivities(limit = 10) {
        return await Activity.find()
            .sort("-createdAt")
            .limit(limit)
            .populate("adminId", "name");
    }
}

module.exports = new ActivityService();
