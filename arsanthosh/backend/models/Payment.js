const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema(
  {
    orderId: { type: String, required: true },
    txnid: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "success", "failed"],
      default: "pending",
    },
    payuTxnId: { type: String },
    fullPayuResponse: { type: mongoose.Schema.Types.Mixed },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    customerName: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "ars_payments" }
);

module.exports = mongoose.model("Payment", paymentSchema);
