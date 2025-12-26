const Order = require("../models/Order");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

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

        order.orderStatus = status;
        await order.save();

        res.status(200).json({
            success: true,
            data: order
        });
    });
}

module.exports = new OrderController();
