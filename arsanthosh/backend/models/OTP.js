const mongoose = require("mongoose");

/**
 * Model to store temporary registration data and OTP.
 * This ensures that users are only added to the main 'ars_users' collection
 * after successful OTP verification.
 */
const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    otp: {
        type: String,
        required: true
    },
    userData: {
        type: Object,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 300 // Auto-delete after 5 minutes (300 seconds)
    }
}, { collection: "ars_otps" });

module.exports = mongoose.model("OTP", otpSchema);
