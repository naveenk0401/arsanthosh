const Order = require("../models/Order");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");
const activityService = require("../services/activityService");
const emailService = require("../services/emailService");

class OrderController {
    // Create new order (Public/Private)
    createOrder = catchAsync(async (req, res) => {
        const { customerName, email, phone, address, items, totalAmount, paymentMethod } = req.body;

        const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

        const newOrder = await Order.create({
            orderId,
            userId: req.user ? req.user._id : null,
            customerName,
            email,
            phone,
            address,
            items,
            totalAmount,
            paymentMethod,
            paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed", // Assume online payments are verified before this call for now
            orderStatus: "Pending"
        });

        // Log Activity
        await activityService.logActivity("PAYMENT", `New Order #${newOrder.orderId} placed by ${customerName} (₹${totalAmount})`, {
            targetTab: "payments",
            targetId: newOrder._id
        });

        res.status(201).json({
            success: true,
            data: newOrder
        });
    });

    // Get All Orders (Admin)
    getAllOrders = catchAsync(async (req, res) => {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    });

    // Get My Orders (User)
    getMyOrders = catchAsync(async (req, res) => {
        const orders = await Order.find({ userId: req.user._id }).sort({ createdAt: -1 });
        res.status(200).json({ success: true, count: orders.length, data: orders });
    });

    // Get Single Order (Admin/User)
    getOrderById = catchAsync(async (req, res) => {
        const order = await Order.findById(req.params.id);
        if (!order) throw new AppError("Order not found", 404);
        res.status(200).json({ success: true, data: order });
    });

    // Update Order Status (Admin) -> Approve/Reject/Ship
    updateOrderStatus = catchAsync(async (req, res) => {
        const { orderId } = req.params;
        const { status } = req.body; // Approved, Rejected, etc.

        const order = await Order.findById(orderId);
        if (!order) throw new AppError("Order not found", 404);

        const oldStatus = order.orderStatus;
        order.orderStatus = status;

        // Special handling for approval
        if (status === "Approved" && oldStatus !== "Approved") {
            // Generate a unique tracking number if not already present
            if (!order.trackingNumber) {
                order.trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
            }

            // Send Confirmation Email
            try {
                await emailService.sendOrderConfirmation(order.email, order);
            } catch (err) {
                console.error("Failed to send order approval email:", err);
                // We continue even if email fails, but log it
            }
        }

        await order.save();

        // Log Activity
        await activityService.logActivity("SYSTEM", `Order #${order.orderId} status updated to: ${status}`, {
            adminId: req.user?.id,
            targetTab: "payments",
            targetId: order._id
        });

        res.status(200).json({
            success: true,
            data: order
        });
    });
}

module.exports = new OrderController();
