const express = require("express");
const adminController = require("../controllers/adminController");
const validate = require("../middleware/validate");
const { adminLoginSchema, createAdminSchema, onboardingSchema } = require("../validators/adminValidator");
const { protect, restrictTo } = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

// Admin Login
router.post("/login", validate(adminLoginSchema), adminController.login);

// Protected Admin Routes
router.use(protect);

// Routes for both Admin and Super Admin
router.get("/stats", restrictTo("admin", "super-admin"), adminController.getDashboardStats);
router.post("/onboarding", validate(onboardingSchema), adminController.completeOnboarding);
router.get("/users", restrictTo("admin", "super-admin"), adminController.getUsers);
router.get("/staff/directory", restrictTo("admin", "super-admin"), adminController.getStaff);
router.post("/upload", adminController.uploadFile); // Shared upload route for all admins

// Super Admin Only Routes
router.use(restrictTo("super-admin"));
router.post("/staff/create", validate(createAdminSchema), adminController.createStaff);
router.get("/pending-admins", adminController.getPendingAdmins);
router.patch("/approve-admin/:adminId", adminController.approveAdmin);

module.exports = router;
