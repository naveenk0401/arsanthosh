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
     * Generates a random alphanumeric secret key.
     */
    generateSecretKey() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += characters.charAt(Math.floor(Math.random() * characters.length));
        }
        return result;
    }

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

        // Role & Approval Logic
        let finalRole = "user";
        let isApproved = true;

        if (userData.adminToken === "ARS-SUPER-2025") {
            finalRole = "super-admin";
            isApproved = true;
        } else if (userData.adminToken === "ARS-ADMIN-2025") {
            finalRole = "admin";
            isApproved = false; // Needs super-admin approval
        }

        let user;
        if (userExists && !userExists.isVerified) {
            // Update existing unverified user
            userExists.name = name;
            userExists.password = hashedPassword;
            userExists.role = finalRole;
            userExists.isApproved = isApproved;
            userExists.otp = otp;
            userExists.otpExpires = otpExpires;
            user = await userExists.save();
        } else {
            // Create new unverified user
            user = await User.create({
                name,
                email,
                password: hashedPassword,
                role: finalRole,
                isVerified: false,
                isApproved,
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
    async login(email, password, secretKeyInput) {
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

        // Super Admin Secret Key Check
        if (user.role === "super-admin") {
            // If user has no secret key yet (fist time or reset), generate one
            if (!user.secretKey) {
                const newKey = this.generateSecretKey();
                user.secretKey = newKey;
                await user.save();
                return {
                    tempSecretKey: newKey,
                    message: "First-time login: A new Security Secret has been generated for you. Please save it securely.",
                    user: { id: user._id, name: user.name, email: user.email, role: user.role },
                    token: this.generateToken(user._id)
                };
            }

            if (!secretKeyInput) {
                return {
                    requiresSecret: true,
                    message: "Super Admin authorization required. Please enter your Security Secret Key."
                };
            }

            if (secretKeyInput !== user.secretKey) {
                throw new AppError("Invalid Security Secret Key", 401);
            }
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
     * Request Secret Key Reset (OTP sent via email)
     */
    async requestSecretReset(email) {
        const user = await User.findOne({ email, role: "super-admin" });
        if (!user) throw new AppError("Super Admin access not found", 404);

        const otp = this.generateOTP();
        user.secretResetOtp = otp;
        user.secretResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        await emailService.sendOTP(email, otp); // Reusing OTP sender
        return { message: "Security override OTP sent to email." };
    }

    /**
     * Verifies OTP and generates a new secret key
     */
    async verifySecretResetAndGenerate(email, otp) {
        const user = await User.findOne({
            email,
            secretResetOtp: otp,
            secretResetExpires: { $gt: Date.now() }
        });

        if (!user) throw new AppError("Invalid or expired Security OTP", 400);

        const newKey = this.generateSecretKey();
        user.secretKey = newKey;
        user.secretResetOtp = undefined;
        user.secretResetExpires = undefined;
        await user.save();

        return {
            newSecretKey: newKey,
            message: "Success. Your new Security Secret has been generated."
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
