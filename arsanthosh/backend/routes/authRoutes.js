const express = require("express");
const authController = require("../controllers/authController");
const validate = require("../middleware/validate");
const { registerSchema, loginSchema, verifyOTPSchema } = require("../validators/authValidator");
const router = express.Router();

const { protect, restrictTo } = require("../middleware/authMiddleware");

/**
 * Public Authentication Routes
 */
router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.post("/verify-otp", validate(verifyOTPSchema), authController.verify);

/**
 * Admin Management Routes (Super Admin only)
 */
router.get("/pending-admins", protect, restrictTo("super-admin"), authController.getPendingAdmins);
router.patch("/approve-admin/:adminId", protect, restrictTo("super-admin"), authController.approveAdmin);
router.get("/users", protect, restrictTo("admin", "super-admin"), authController.getUsers);

router.post("/staff/create", protect, restrictTo("super-admin"), authController.createStaff);
router.post("/staff/onboarding", protect, authController.completeOnboarding);
router.get("/staff/directory", protect, restrictTo("super-admin"), authController.getStaff);

// Super Admin Secondary Auth Override
router.post("/forgot-secret", authController.requestSecretReset);
router.post("/reset-secret", authController.verifySecretReset);

/**
 * Obscure Admin Routes (Backend)
 */
router.post("/access-auth-v1", authController.login);

module.exports = router;
