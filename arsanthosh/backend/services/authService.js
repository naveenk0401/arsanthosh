const User = require("../models/User");
const emailService = require("./emailService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const AppError = require("../utils/AppError");

/**
 * Service to handle Authentication Business Logic.
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

        // Check if verified user exists
        const userExists = await User.findOne({ email });

        if (userExists && userExists.isVerified) {
            throw new AppError("User already exists", 400);
        }

        const otp = this.generateOTP();
        const otpExpires = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
        const hashedPassword = await bcrypt.hash(password, 10);

        let user;
        if (userExists && !userExists.isVerified) {
            // Update existing unverified user
            userExists.name = name;
            userExists.password = hashedPassword;
            userExists.role = role || "user";
            userExists.otp = otp;
            userExists.otpExpires = otpExpires;
            user = await userExists.save();
        } else {
            // Create new unverified user
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: role || "user",
                isVerified: false,
                isApproved: false,
                otp,
                otpExpires,
            });
        }

        // Send email
        await emailService.sendOTP(email, otp);

        return {
            message: "OTP sent to email. Please verify to complete registration.",
            email,
        };
    }

    /**
     * Verifies the OTP.
     */
    async verifyOTP(email, otp) {
        const user = await User.findOne({
            email,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) throw new AppError("Invalid or expired OTP", 400);

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;

        // Auto-approve regular users
        if (user.role === "user") {
            user.isApproved = true;
            emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);
        }

        await user.save();

        if (user.role === "admin") {
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
            const otp = this.generateOTP();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 5 * 60 * 1000);
            await user.save();
            await emailService.sendOTP(email, otp);
            throw new AppError("Account not verified. A new OTP has been sent.", 403);
        }

        if (!user.isApproved) {
            throw new AppError("Your account is pending approval.", 403);
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

    async approveAdmin(adminId) {
        const admin = await User.findById(adminId);
        if (!admin) throw new AppError("Admin not found", 404);
        admin.isApproved = true;
        await admin.save();
        return { message: "Admin approved" };
    }

    async getPendingAdmins() {
        return await User.find({ role: "admin", isApproved: false, isVerified: true });
    }

    async getAllUsers() {
        return await User.find({ role: "user" }).select("-password -otp -otpExpires");
    }
}

module.exports = new AuthService();
