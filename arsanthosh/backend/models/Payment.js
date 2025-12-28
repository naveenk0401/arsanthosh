const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    transactionId: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "verified", "failed"],
      default: "pending",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    }, // Store guest customers or users
    customerName: { type: String },
    method: {
      type: String,
      enum: ["UPI", "Razorpay", "Card", "Cash"],
      default: "Razorpay",
    },
    type: {
      type: String,
      enum: ["Product", "Consultation", "Others"],
      default: "Product",
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "ars_payments" }
);

module.exports = mongoose.model("Payment", paymentSchema);
