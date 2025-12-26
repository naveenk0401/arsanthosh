const mongoose = require("mongoose");

const pendingUserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
}, { collection: "ars_pending_users" });

// TTL index to automatically remove expired pending registrations (5 minutes)
pendingUserSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

module.exports = mongoose.model("PendingUser", pendingUserSchema);
