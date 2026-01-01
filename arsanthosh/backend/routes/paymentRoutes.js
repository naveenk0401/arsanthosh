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

// Webhook & Callback (PayU POSTs/GETs) - Expects application/x-www-form-urlencoded
const formParser = express.urlencoded({ extended: true });

router.post("/webhook", formParser, paymentController.handleWebhook);
router.get("/webhook", paymentController.handleWebhook);

router.post("/callback", formParser, paymentController.handleCallback);
router.get("/callback", paymentController.handleCallback);

// Admin / User
router.use(protect);
router.get("/my-payments", paymentController.getMyPayments);

router.use(restrictTo("admin", "super-admin"));
router.get("/", paymentController.getAllPayments);

module.exports = router;
