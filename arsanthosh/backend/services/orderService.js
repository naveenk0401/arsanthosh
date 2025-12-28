const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const activityService = require("./activityService");
const emailService = require("./emailService");

const createOrder = async (orderData, user) => {
    const { customerName, email, phone, address, items, totalAmount, paymentMethod } = orderData;
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const newOrder = await Order.create({
        orderId,
        userId: user ? user._id : null,
        customerName,
        email,
        phone,
        address,
        items,
        totalAmount,
        paymentMethod,
        paymentStatus: paymentMethod === "COD" ? "Pending" : "Completed",
        orderStatus: "Pending"
    });

    await activityService.logActivity("PAYMENT", `New Order #${newOrder.orderId} placed by ${customerName} (₹${totalAmount})`, {
        targetTab: "payments",
        targetId: newOrder._id
    });

    return newOrder;
};

const getAllOrders = async () => {
    return await Order.find().sort({ createdAt: -1 });
};

const getMyOrders = async (userId) => {
    return await Order.find({ userId }).sort({ createdAt: -1 });
};

const getOrderById = async (id) => {
    const order = await Order.findById(id);
    if (!order) throw new AppError("Order not found", 404);
    return order;
};

const updateOrderStatus = async (orderId, status, adminId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new AppError("Order not found", 404);

    const oldStatus = order.orderStatus;
    order.orderStatus = status;

    if (status === "Approved" && oldStatus !== "Approved") {
        if (!order.trackingNumber) {
            order.trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
        }

        try {
            await emailService.sendOrderConfirmation(order.email, order);
        } catch (err) {
            console.error("Failed to send order approval email:", err);
        }
    }

    await order.save();

    await activityService.logActivity("SYSTEM", `Order #${order.orderId} status updated to: ${status}`, {
        adminId,
        targetTab: "payments",
        targetId: order._id
    });

    return order;
};

module.exports = {
    createOrder,
    getAllOrders,
    getMyOrders,
    getOrderById,
    updateOrderStatus
};
