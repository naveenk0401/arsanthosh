const express = require("express");
const authController = require("../controllers/authController");
const router = express.Router();

/**
 * Public Authentication Routes
 */
router.post("/register", (req, res) => authController.register(req, res));
router.post("/login", (req, res) => authController.login(req, res));
router.post("/verify-otp", (req, res) => authController.verify(req, res));

/**
 * Obscure Admin Routes (Backend)
 * These can be further protected by custom headers known only to the frontend.
 */
router.post("/access-auth-v1", (req, res) => authController.login(req, res)); // Obscure admin login endpoint

module.exports = router;
