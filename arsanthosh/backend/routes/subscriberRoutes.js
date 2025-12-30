const express = require("express");
const router = express.Router();
const {
  subscribe,
  getSubscribers,
  sendBulkEmail,
} = require("../controllers/subscriberController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Public routes
router.post("/", subscribe);

// Admin only routes
router.use(protect); // All routes below are protected
router.use(restrictTo("admin", "super-admin"));

router.get("/", getSubscribers);
router.post("/send-update", sendBulkEmail);

module.exports = router;
