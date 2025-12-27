const Payment = require("../models/Payment");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const activityService = require("../services/activityService");

class PaymentController {
    // Create a new payment/order
    createPayment = catchAsync(async (req, res) => {
        const { amount, method, status, transactionId, customerName, type, items } = req.body;

        // items could be stored if we update the Payment model or create a separate Order model.
        // For now, adhering to existing Payment model but adding logic.

        const payment = await Payment.create({
            transactionId: transactionId || `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            amount,
            method,
            status: status || "verified", // Auto-verify for now since it's a demo
            customerName: customerName || (req.user ? req.user.name : "Guest"),
            userId: req.user ? req.user._id : null,
            type: type || "Product"
        });

        // Log Activity
        await activityService.logActivity("PAYMENT", `Transaction verified: ${payment.transactionId} - ₹${amount} (${customerName})`, {
            adminId: req.user?.id,
            targetTab: "payments",
            targetId: payment._id
        });

        res.status(201).json({
            success: true,
            data: payment
        });
    });

    // Get all payments (for Admin)
    getAllPayments = catchAsync(async (req, res) => {
        const payments = await Payment.find().sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    });

    // Get my payments (for User)
    getMyPayments = catchAsync(async (req, res) => {
        const payments = await Payment.find({ userId: req.user._id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: payments.length,
            data: payments
        });
    });
}

module.exports = new PaymentController();
