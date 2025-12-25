const express = require("express");
const projectController = require("../controllers/projectController");
const { protect, restrictTo } = require("../middleware/authMiddleware");

const router = express.Router();

// Public Routes
router.get("/", projectController.getAllProjects);
router.get("/:slug", projectController.getProject);

// Protected Admin Routes
router.use(protect); // All routes below this line require login
router.use(restrictTo("admin", "super-admin")); // All routes below require admin role

router.post("/", projectController.createProject);
router.patch("/:id", projectController.updateProject);
router.delete("/:id", projectController.deleteProject);

module.exports = router;
