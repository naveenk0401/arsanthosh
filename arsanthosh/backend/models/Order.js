const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    orderId: { type: String, required: true, unique: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: false }, // Nullable for guest
    customerName: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    address: { type: String, required: true },
    items: [{
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String },
        quantity: { type: Number },
        price: { type: Number },
        image: { type: String }
    }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["Card", "UPI", "NetBanking", "COD"], required: true },
    paymentStatus: { type: String, enum: ["Pending", "Completed", "Failed"], default: "Pending" },
    orderStatus: { type: String, enum: ["Pending", "Approved", "Rejected", "Shipped", "Delivered"], default: "Pending" },
    createdAt: { type: Date, default: Date.now },
}, { collection: "ars_orders" });

module.exports = mongoose.model("Order", orderSchema);
