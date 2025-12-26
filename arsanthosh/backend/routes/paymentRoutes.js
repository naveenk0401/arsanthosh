const express = require("express");
const paymentController = require("../controllers/paymentController");
const { protect, restrictTo, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", optionalAuth, paymentController.createPayment);

// Protect admin routes
router.use(protect);
router.get("/my-payments", paymentController.getMyPayments);

router.use(restrictTo("admin", "super-admin"));
router.get("/", paymentController.getAllPayments);

module.exports = router;
