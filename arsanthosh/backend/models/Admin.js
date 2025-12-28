const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const adminSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: {
      type: String,
      enum: ["super-admin", "admin", "junior"],
      default: "admin",
    },
    isVerified: { type: Boolean, default: true },
    isApproved: { type: Boolean, default: true },
    isFirstLogin: { type: Boolean, default: true },
    secretKey: { type: String }, // For secondary authentication
    dob: { type: Date },
    idProofType: { type: String, enum: ["adhar", "pan", "10th mark sheet"] },
    idProofNumber: { type: String },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: "ars_admins", timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
