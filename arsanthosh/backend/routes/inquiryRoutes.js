const express = require("express");
const inquiryController = require("../controllers/inquiryController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Route (Contact Form)
router.post("/", inquiryController.createInquiry);

// Protected Admin Routes (Dashboard)
router.use(protect);
router.use(restrictTo("admin", "super-admin"));

router.get("/", inquiryController.getInquiries);
router.patch("/:id", inquiryController.updateStatus);

module.exports = router;
