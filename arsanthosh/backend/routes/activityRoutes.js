const express = require("express");
const activityService = require("../services/activityService");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Protected Admin Routes
router.use(protect);
router.use(restrictTo("admin", "super-admin"));

router.get("/", async (req, res, next) => {
    try {
        const activities = await activityService.getRecentActivities(20);
        res.status(200).json({
            success: true,
            data: activities
        });
    } catch (err) {
        next(err);
    }
});

module.exports = router;
