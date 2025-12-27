const User = require("../models/User");
const OTP = require("../models/OTP");
const emailService = require("./emailService");
const AppError = require("../utils/AppError");
const activityService = require("./activityService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

/**
 * Service to handle Authentication Business Logic.
 */
class AuthService {
    /**
     * Generates a 12-digit random alphanumeric secret key.
     */
    generateSecretKey() {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < 12; i++) {
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
        const { name, email, password, phone } = userData;
        const normalizedEmail = email.toLowerCase().trim();

        // Check if verified user exists in main collection
        const userExists = await User.findOne({ email: normalizedEmail });
        if (userExists) {
            throw new AppError("User already exists", 400);
        }

        const otp = this.generateOTP();
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

        const newUserPayload = {
            name,
            email: normalizedEmail,
            password: hashedPassword,
            phone,
            role: finalRole,
            isApproved,
            isVerified: true
        };

        // Save to temporary OTP collection (upsert)
        await OTP.findOneAndUpdate(
            { email: normalizedEmail },
            { otp, userData: newUserPayload },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        // Send email
        await emailService.sendOTP(normalizedEmail, otp);

        return {
            message: "OTP sent to email. Please verify to complete registration.",
            email: normalizedEmail,
        };
    }

    /**
     * Verifies the OTP and creates the user.
     */
    async verifyOTP(email, otp) {
        const normalizedEmail = email.toLowerCase().trim();

        // 1. Find OTP entry
        const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });
        if (!otpRecord) {
            throw new AppError("Invalid or expired OTP", 400);
        }

        // 2. Create actual user in main collection
        const user = await User.create(otpRecord.userData);

        // 3. Delete temporary record
        await OTP.deleteOne({ _id: otpRecord._id });

        // 4. Handle post-creation logic
        let secretKey = null;
        if (user.role === "super-admin" || user.role === "admin") {
            secretKey = this.generateSecretKey();
            user.secretKey = secretKey;
            await user.save();
        }

        if (user.role === "user") {
            emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);
        }

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
            message: (user.role === "super-admin" || user.role === "admin") ? "Verification successful. SAVE YOUR SECRET KEY!" : "Verification successful",
            secretKey: secretKey || undefined,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
            },
            token: user.role === "super-admin" || user.isApproved ? this.generateToken(user._id) : null,
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

        if (!user.isApproved) {
            throw new AppError("Your account is pending approval.", 403);
        }

        // Admin & Super Admin Secret Key Check
        if (user.role === "super-admin" || user.role === "admin") {
            // First time login bypasses secret key check
            if (user.isFirstLogin) {
                return {
                    message: "First login successful. Password update required.",
                    isFirstLogin: true,
                    user: {
                        id: user._id,
                        name: user.name,
                        email: user.email,
                        role: user.role,
                    },
                    token: this.generateToken(user._id),
                };
            }

            if (!secretKeyInput) {
                throw new AppError("Administrative login requires your 12-digit Security Secret Key", 401);
            }

            if (secretKeyInput !== user.secretKey) {
                throw new AppError("Invalid Security Secret Key", 401);
            }
        }

        return {
            message: "Login successful",
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
    async requestSecretReset(email, phone) {
        const user = await User.findOne({ email, phone, role: "super-admin" });
        if (!user) throw new AppError("No Super Admin found with matching email and phone number", 404);

        const otp = this.generateOTP();
        user.secretResetOtp = otp;
        user.secretResetExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 mins
        await user.save();

        await emailService.sendOTP(email, otp);
        return { message: "Security override OTP sent to your verified email." };
    }

    /**
     * Verifies OTP, updates password and regenerates a new secret key
     */
    async verifySecretResetAndGenerate(email, otp, newPassword) {
        const user = await User.findOne({
            email,
            secretResetOtp: otp,
            secretResetExpires: { $gt: Date.now() },
            role: "super-admin"
        });

        if (!user) throw new AppError("Invalid or expired reset OTP", 400);

        // Update password
        user.password = await bcrypt.hash(newPassword, 10);

        // Regenerate secret key
        const newSecretKey = this.generateSecretKey();
        user.secretKey = newSecretKey;

        // Clear reset fields
        user.secretResetOtp = undefined;
        user.secretResetExpires = undefined;

        await user.save();

        return {
            message: "Password updated and new Security Secret generated. Please save it securely.",
            newSecretKey
        };
    }

    async approveAdmin(adminId) {
        const admin = await User.findById(adminId);
        if (!admin) throw new AppError("Admin not found", 404);
        admin.isApproved = true;
        await admin.save();

        // Log Activity
        await activityService.logActivity("STAFF", `Admin account approved: ${admin.name} (${admin.email})`, {
            targetTab: "staff",
            targetId: admin._id
        });

        return { message: "Admin approved" };
    }

    async getPendingAdmins() {
        return await User.find({ role: "admin", isApproved: false, isVerified: true });
    }

    async getAllUsers() {
        return await User.find({ role: "user" }).select("-password -otp -otpExpires");
    }

    /**
     * Super Admin creates a new Admin account.
     */
    async createAdmin(adminData, adminId) {
        const superAdmin = await User.findById(adminId);
        if (!superAdmin || superAdmin.role !== "super-admin") {
            throw new AppError("Only Super Admins can create administrative staff.", 403);
        }

        const { name, email, password, phone, dob, idProofType, idProofNumber } = adminData;

        const userExists = await User.findOne({ email: email.toLowerCase() });
        if (userExists) throw new AppError("User with this email already exists.", 400);

        const hashedPassword = await bcrypt.hash(password, 10);

        const newAdmin = await User.create({
            name,
            email: email.toLowerCase().trim(),
            password: hashedPassword,
            phone,
            dob,
            idProofType,
            idProofNumber,
            role: "admin",
            isApproved: true,
            isVerified: true,
            isFirstLogin: true
        });

        // Send credentials email
        await emailService.sendAdminCredentials(newAdmin.email, password, newAdmin.name);

        // Log Activity
        await activityService.logActivity("STAFF", `New Admin created: ${newAdmin.name}`, {
            adminId: superAdmin._id,
            targetTab: "staff",
            targetId: newAdmin._id
        });

        return {
            message: "Administrative account created and credentials sent to email.",
            admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email }
        };
    }

    /**
     * Mandatory first-login onboarding for new admins.
     */
    async completeOnboarding(adminId, newPassword) {
        const admin = await User.findById(adminId);
        if (!admin) throw new AppError("Staff account not found.", 404);
        if (!admin.isFirstLogin) throw new AppError("Account is already onboarded.", 400);

        // Update password
        admin.password = await bcrypt.hash(newPassword, 10);
        admin.isFirstLogin = false;

        // Generate the 12-digit secret key
        const secretKey = this.generateSecretKey();
        admin.secretKey = secretKey;

        await admin.save();

        // Log Activity
        await activityService.logActivity("STAFF", `Admin onboarding completed: ${admin.name}`, {
            targetTab: "staff",
            targetId: admin._id
        });

        return {
            message: "Onboarding complete. SAVE YOUR SECURITY SECRET KEY!",
            secretKey,
            user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
        };
    }

    async getAllStaff() {
        return await User.find({ role: { $in: ["admin", "super-admin"] } }).select("-password");
    }
}

module.exports = new AuthService();
