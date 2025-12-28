const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "super-admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    isFirstLogin: { type: Boolean, default: true }, // For mandatory password reset
    dob: { type: Date },
    idProofType: { type: String, enum: ["adhar", "pan", "10th mark sheet"] },
    idProofNumber: { type: String },
    secretKey: { type: String }, // For super-admin second layer
    secretResetOtp: { type: String },
    secretResetExpires: { type: Date },
    createdAt: { type: Date, default: Date.now },
}, { collection: "ars_users" });

userSchema.index({ createdAt: -1 });

module.exports = mongoose.model("User", userSchema);
