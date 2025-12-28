const Payment = require("../models/Payment");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const activityService = require("../services/activityService");

const createPayment = catchAsync(async (req, res) => {
    const { amount, method, status, transactionId, customerName, type } = req.body;

    const payment = await Payment.create({
        transactionId: transactionId || `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
        amount,
        method,
        status: status || "verified",
        customerName: customerName || (req.user ? req.user.name : "Guest"),
        userId: req.user ? req.user._id : null,
        type: type || "Product"
    });

    await activityService.logActivity("PAYMENT", `Transaction verified: ${payment.transactionId} - ₹${amount} (${customerName})`, {
        adminId: req.user?.id,
        targetTab: "payments",
        targetId: payment._id
    });

    return ApiResponse.success(res, 201, payment, "Payment created successfully");
});

const getAllPayments = catchAsync(async (req, res) => {
    const payments = await Payment.find().sort({ createdAt: -1 });
    return ApiResponse.success(res, 200, payments, "Payments fetched successfully");
});

const getMyPayments = catchAsync(async (req, res) => {
    const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });
    return ApiResponse.success(res, 200, payments, "My payments fetched successfully");
});

module.exports = {
    createPayment,
    getAllPayments,
    getMyPayments
};
