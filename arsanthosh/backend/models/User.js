const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "super-admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    otp: { type: String },
    otpExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
}, { collection: "ars_users" });

module.exports = mongoose.model("User", userSchema);
