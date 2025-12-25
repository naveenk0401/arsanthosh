const User = require("../models/User");
const emailService = require("./emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

/**
 * Service to handle Authentication Business Logic.
 * Decoupled from Express response objects for testability and scaling.
 */
class AuthService {
    /**
     * Generates a 6-digit random OTP.
     */
    generateOTP() {
        return Math.floor(100000 + Math.random() * 900000).toString();
    }

    /**
     * Generates a JWT token.
     */
    generateToken(id) {
        return jwt.sign({ id }, process.env.JWT_SECRET || "defaultsecret", {
            expiresIn: "30d",
        });
    }

    /**
     * Registers a new user and sends an OTP.
     */
    async register(userData) {
        const { name, email, password, role } = userData;

        const userExists = await User.findOne({ email });
        if (userExists) throw new AppError("User already exists", 400);

        const otp = this.generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        // Users are auto-approved, admins and super-admins need approval
        const isApproved = role === "user" || !role;

        // Hash password before saving
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || "user",
            isVerified: false,
            isApproved,
            otp,
            otpExpires,
        });

        // Send email asynchronously
        await emailService.sendOTP(email, otp);

        const responseMessage = role === "admin"
            ? "OTP sent. Please verify. Note: Admin accounts require super-admin approval after verification."
            : "OTP sent to email. Please verify to complete registration.";

        return {
            message: responseMessage,
            userId: user._id,
        };
    }

    /**
     * Verifies the OTP.
     */
    async verifyOTP(email, otp) {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) throw new AppError("Invalid or expired OTP", 400);

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        // Finalize approval for users
        if (user.role === "user") {
            user.isApproved = true;
            // Send welcome email asynchronously
            emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);
        }

        await user.save();

        if (!user.isApproved) {
            return {
                message: "Email verified successfully. Your admin account is now pending super-admin approval.",
                isApproved: false,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            };
        }

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: this.generateToken(user._id),
        };
    }

    /**
     * Handles user login.
     */
    async login(email, password) {
        const user = await User.findOne({ email });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new AppError("Invalid email or password", 401);
        }

        if (!user.isVerified) {
            // If not verified, trigger a new OTP
            const otp = this.generateOTP();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();
            await emailService.sendOTP(email, otp);
            throw new AppError("Account not verified. A new OTP has been sent to your email.", 403);
        }

        if (!user.isApproved) {
            throw new AppError("Your account is pending super-admin approval.", 403);
        }

        return {
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: this.generateToken(user._id),
        };
    }
    /**
     * Approves a pending admin account.
     */
    async approveAdmin(adminId) {
        const admin = await User.findById(adminId);
        if (!admin) throw new AppError("Admin not found", 404);
        if (admin.role !== "admin") throw new AppError("User is not an admin", 400);

        admin.isApproved = true;
        await admin.save();

        return {
            message: `Admin ${admin.name} approved successfully.`,
        };
    }

    /**
     * Lists all pending admin accounts.
     */
    async getPendingAdmins() {
        return await User.find({ role: "admin", isApproved: false, isVerified: true });
    }

    /**
     * Lists all registered users (for admin dashboard).
     */
    async getAllUsers() {
        return await User.find({ role: "user" }).select("-password -otp -otpExpires");
    }
}

module.exports = new AuthService();
