const express = require("express");
const router = express.Router();
const productController = require("../controllers/productController");
// Assuming there's an auth middleware
const { protect, restrictTo } = require("../middleware/authMiddleware");

// Public routes
router.get("/", productController.getAllProducts);
router.get("/slug/:slug", productController.getProductBySlug);
router.get("/:id", productController.getProductById);

// Admin only routes
router.use(protect); // All following routes require login
router.use(restrictTo("admin", "super-admin"));

router.post("/", productController.createProduct);
router.patch("/:id", productController.updateProduct);
router.delete("/:id", productController.deleteProduct);
router.patch("/:id/stock", productController.updateStock);

module.exports = router;
