const Product = require("../models/Product");
const Review = require("../models/Review");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const activityService = require("../services/activityService");

class ProductController {
    // Get all products with filtering, searching, and pagination
    getAllProducts = catchAsync(async (req, res) => {
        let query = {};
        const { category, minPrice, maxPrice, isFeatured, search, page = 1, limit = 10, status } = req.query;

        // Filtering
        if (category) query.category = category;
        if (isFeatured) query.isFeatured = isFeatured === "true";
        if (status && status !== "all") query.status = status;
        else if (!status) query.status = "published";

        // Price Range
        if (minPrice || maxPrice) {
            query.price = {};
            if (minPrice) query.price.$gte = Number(minPrice);
            if (maxPrice) query.price.$lte = Number(maxPrice);
        }

        // Search
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: "i" } },
                { description: { $regex: search, $options: "i" } }
            ];
        }

        // Pagination
        const pageNum = Number(page);
        const limitNum = Number(limit);
        const skip = (pageNum - 1) * limitNum;

        const products = await Product.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limitNum);

        const total = await Product.countDocuments(query);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            pages: Math.ceil(total / limitNum),
            currentPage: pageNum,
            data: products
        });
    });

    // Get single product details with reviews
    getProductById = catchAsync(async (req, res) => {
        const product = await Product.findById(req.params.id);
        if (!product) throw new AppError("Product not found", 404);

        const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                ...product._doc,
                reviews
            }
        });
    });

    // Create a new product (Admin Only)
    createProduct = catchAsync(async (req, res) => {
        const { name } = req.body;
        // Simple slug generation
        const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

        const product = await Product.create({
            ...req.body,
            slug
        });

        // Log Activity
        await activityService.logActivity("PRODUCT", `New product added: ${product.name}`, {
            adminId: req.user?.id,
            targetTab: "products",
            targetId: product._id
        });

        res.status(201).json({
            success: true,
            data: product
        });
    });

    // Get product by slug (Public)
    getProductBySlug = catchAsync(async (req, res) => {
        const product = await Product.findOne({ slug: req.params.slug, status: "published" });
        if (!product) throw new AppError("Product not found", 404);

        const reviews = await Review.find({ productId: product._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: {
                ...product._doc,
                reviews
            }
        });
    });

    // Update product (Admin Only)
    updateProduct = catchAsync(async (req, res) => {
        const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!product) throw new AppError("Product not found", 404);

        res.status(200).json({
            success: true,
            data: product
        });
    });

    // Delete product (Admin Only)
    deleteProduct = catchAsync(async (req, res) => {
        const product = await Product.findByIdAndDelete(req.params.id);
        if (!product) throw new AppError("Product not found", 404);

        // Also delete associated reviews
        await Review.deleteMany({ productId: product._id });

        res.status(200).json({
            success: true,
            message: "Product and associated reviews deleted"
        });
    });

    // Special Inventory Management (Admin Only)
    updateStock = catchAsync(async (req, res) => {
        const { stock } = req.body;
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { stock },
            { new: true }
        );

        if (!product) throw new AppError("Product not found", 404);

        // Log Activity
        await activityService.logActivity("PRODUCT", `Inventory updated for ${product.name}: ${stock} items in stock`, {
            adminId: req.user?.id,
            targetTab: "products",
            targetId: product._id
        });

        res.status(200).json({
            success: true,
            message: "Stock updated",
            data: { stock: product.stock }
        });
    });
}

module.exports = new ProductController();
