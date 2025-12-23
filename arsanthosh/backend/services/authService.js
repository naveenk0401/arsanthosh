const User = require("../models/User");
const emailService = require("./emailService");
const jwt = require("jsonwebtoken");

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
        if (userExists) throw new Error("User already exists");

        const otp = this.generateOTP();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

        const user = await User.create({
            name,
            email,
            password,
            role: role || "user",
            isVerified: false,
            otp,
            otpExpires,
        });

        // Send email asynchronously
        await emailService.sendOTP(email, otp);

        return {
            message: "OTP sent to email. Please verify to complete registration.",
            userId: user._id,
        };
    }

    /**
     * Verifies the OTP.
     */
    async verifyOTP(email, otp) {
        const user = await User.findOne({ email, otp, otpExpires: { $gt: Date.now() } });
        if (!user) throw new Error("Invalid or expired OTP");

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

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
        if (!user || !(await user.comparePassword(password))) {
            throw new Error("Invalid email or password");
        }

        if (!user.isVerified) {
            // If not verified, trigger a new OTP
            const otp = this.generateOTP();
            user.otp = otp;
            user.otpExpires = new Date(Date.now() + 10 * 60 * 1000);
            await user.save();
            await emailService.sendOTP(email, otp);
            throw new Error("ACCOUNT_NOT_VERIFIED: OTP sent to your email.");
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
}

module.exports = new AuthService();
