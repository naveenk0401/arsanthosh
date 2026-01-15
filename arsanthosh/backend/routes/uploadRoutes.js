const express = require("express");
const adminController = require("../controllers/adminController");
const { protect } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Protected upload route
router.post("/", protect, upload.single("file"), adminController.uploadFile);

module.exports = router;
