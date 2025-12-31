const express = require("express");
const paymentController = require("../controllers/paymentController");
const {
  protect,
  restrictTo,
  optionalAuth,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Public / Guest / User
router.post("/initiate", optionalAuth, paymentController.initiatePayment);

// Callback from PayU S2S (POST)
router.post(
  "/callback",
  express.urlencoded({ extended: true }),
  paymentController.handleCallback
);

// Webhook (PayU S2S) - No Auth needed, uses Hash verification
router.post(
  "/webhook",
  express.urlencoded({ extended: true }),
  paymentController.verifyPayment
);

// Admin / User
router.use(protect);
router.get("/my-payments", paymentController.getMyPayments);

router.use(restrictTo("admin", "super-admin"));
router.get("/", paymentController.getAllPayments);

module.exports = router;
