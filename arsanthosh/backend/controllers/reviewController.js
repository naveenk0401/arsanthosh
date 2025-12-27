const Review = require("../models/Review");
const Product = require("../models/Product");
const AppError = require("../utils/AppError");
const catchAsync = require("../utils/catchAsync");
const activityService = require("../services/activityService");

class ReviewController {
    // Add a review to a product
    addReview = catchAsync(async (req, res) => {
        const { productId, rating, comment } = req.body;
        const userId = req.user._id;
        const userName = req.user.name;

        // Check if user already reviewed this product
        const existingReview = await Review.findOne({ productId, userId });
        if (existingReview) throw new AppError("You have already reviewed this product", 400);

        const review = await Review.create({
            productId,
            userId,
            userName,
            rating,
            comment
        });

        // Log Activity
        await activityService.logActivity("PRODUCT", `New Review on a product: ${rating} stars`, {
            targetTab: "products",
            targetId: productId
        });

        // Update product average rating
        const reviews = await Review.find({ productId });
        const avgRating = reviews.reduce((acc, rev) => acc + rev.rating, 0) / reviews.length;

        await Product.findByIdAndUpdate(productId, {
            averageRating: avgRating,
            numReviews: reviews.length
        });

        res.status(201).json({
            success: true,
            data: review
        });
    });

    // Get reviews for a product (already partially handled in getProductById, but good for dedicated tab)
}

module.exports = new ReviewController();
