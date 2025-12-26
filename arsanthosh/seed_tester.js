const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

// Define schema directly to avoid path issues
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "super-admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    secretKey: { type: String },
    createdAt: { type: Date, default: Date.now },
}, { collection: "ars_users" });

const User = mongoose.models.User || mongoose.model("User", userSchema);

require("dotenv").config({ path: "./backend/.env" });

const seedAdmin = async () => {
    try {
        console.log("Connecting to:", process.env.MONGO_URI || "mongodb://localhost:27017/arsanthosh");
        await mongoose.connect(process.env.MONGO_URI || "mongodb://localhost:27017/arsanthosh");
        console.log("Connected.");

        const email = "tester-admin@example.com";
        const password = "AdminPassword123";
        const hashedPassword = await bcrypt.hash(password, 10);

        await User.deleteOne({ email });

        await User.create({
            name: "Test Admin",
            email,
            password: hashedPassword,
            role: "super-admin",
            isVerified: true,
            isApproved: true,
            secretKey: "SECRET123" // Manually set a secret key to avoid "requiresSecret" logic during initial login for testing
        });

        console.log("Super Admin seeded successfully");
        console.log(`Email: ${email}`);
        console.log(`Password: ${password}`);
        console.log(`Secret Key: SECRET123`);
        process.exit(0);
    } catch (error) {
        console.error("Seeding error:", error);
        process.exit(1);
    }
};

seedAdmin();
