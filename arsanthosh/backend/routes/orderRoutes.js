const express = require("express");
const orderController = require("../controllers/orderController");
const { protect, restrictTo, optionalAuth } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Order (Public/User)
router.post("/", optionalAuth, orderController.createOrder);

// User History
router.get("/my-orders", protect, orderController.getMyOrders);

// Admin Management
router.use(protect, restrictTo("admin", "super-admin"));
router.get("/", orderController.getAllOrders);
router.get("/:id", orderController.getOrderById);
router.patch("/:orderId/status", orderController.updateOrderStatus);

module.exports = router;
