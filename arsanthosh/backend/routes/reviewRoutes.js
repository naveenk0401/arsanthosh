const express = require("express");
const router = express.Router();
const reviewController = require("../controllers/reviewController");
const { protect } = require("../middleware/authMiddleware");

// All review submissions require login
router.post("/", protect, reviewController.addReview);

module.exports = router;
