const express = require("express");
const settingsController = require("../controllers/settingsController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Public route to get social links
router.get("/social-links", settingsController.getSocialLinks);

// Admin route to update social links
router.patch(
  "/social-links",
  protect,
  restrictTo("admin"),
  settingsController.updateSocialLinks
);

module.exports = router;
