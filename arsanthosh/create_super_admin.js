const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");
const path = require("path");

// Load env
dotenv.config({ path: path.join(__dirname, "backend", ".env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/arsanthosh";

// User Schema (Simplified for script)
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "super-admin"], default: "user" },
    isVerified: { type: Boolean, default: false },
    isApproved: { type: Boolean, default: false },
    secretKey: { type: String },
    createdAt: { type: Date, default: Date.now },
}, { collection: "ars_users" });

const User = mongoose.model("User", UserSchema);

function generateSecretKey() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

async function createSuperAdmin() {
    const args = process.argv.slice(2);
    if (args.length < 4) {
        console.log("Usage: node create_super_admin.js <name> <email> <password> <phone>");
        process.exit(1);
    }

    const [name, email, password, phone] = args;

    try {
        await mongoose.connect(MONGO_URI);
        console.log("Connected to MongoDB:", MONGO_URI);

        const hashed = await bcrypt.hash(password, 10);
        const secretKey = generateSecretKey();

        const superAdmin = new User({
            name,
            email: email.toLowerCase().trim(),
            password: hashed,
            phone,
            role: "super-admin",
            isVerified: true,
            isApproved: true,
            secretKey
        });

        await superAdmin.save();

        console.log("\n✅ Super Admin Created Successfully!");
        console.log("----------------------------------");
        console.log(`Email:      ${email}`);
        console.log(`Password:   ${password}`);
        console.log(`Secret Key: ${secretKey}`);
        console.log("----------------------------------");
        console.log("IMPORTANT: Save the Secret Key now. You will need it for login.");

    } catch (err) {
        console.error("\n❌ Error creating Super Admin:", err.message);
    } finally {
        await mongoose.disconnect();
    }
}

createSuperAdmin();
