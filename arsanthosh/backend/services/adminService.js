const Admin = require("../models/Admin");
const User = require("../models/User");
const OTP = require("../models/OTP");
const emailService = require("./emailService");
const AppError = require("../utils/AppError");
const activityService = require("./activityService");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const generateSecretKey = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
};

const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "defaultsecret", {
        expiresIn: "30d",
    });
};

const adminLogin = async (email, password, secretKeyInput) => {
    const admin = await Admin.findOne({ email });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
        throw new AppError("Invalid email or password", 401);
    }

    if (!admin.isApproved) {
        throw new AppError("Your account is pending approval.", 403);
    }

    if (admin.role === "super-admin" || admin.role === "admin") {
        if (admin.role === "admin" && admin.isFirstLogin) {
            return {
                message: "First login successful. Password update required.",
                isFirstLogin: true,
                user: {
                    id: admin._id,
                    name: admin.name,
                    email: admin.email,
                    role: admin.role,
                },
                token: generateToken(admin._id),
            };
        }

        if (!secretKeyInput) {
            throw new AppError("Administrative login requires your 12-digit Security Secret Key", 401);
        }

        if (secretKeyInput !== admin.secretKey) {
            throw new AppError("Invalid Security Secret Key", 401);
        }
    }

    return {
        message: "Login successful",
        user: {
            id: admin._id,
            name: admin.name,
            email: admin.email,
            role: admin.role,
        },
        token: generateToken(admin._id),
    };
};

const createStaff = async (adminData, superAdminId) => {
    const superAdmin = await Admin.findById(superAdminId);
    if (!superAdmin || superAdmin.role !== "super-admin") {
        throw new AppError("Only Super Admins can create administrative staff.", 403);
    }

    const { name, email, password, phone, dob, idProofType, idProofNumber, role } = adminData;

    const adminExists = await Admin.findOne({ email: email.toLowerCase() });
    if (adminExists) throw new AppError("Staff with this email already exists.", 400);

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await Admin.create({
        name,
        email: email.toLowerCase().trim(),
        password: hashedPassword,
        phone,
        dob,
        idProofType,
        idProofNumber,
        role: role || "admin",
        isApproved: true,
        isVerified: true,
        isFirstLogin: true
    });

    await emailService.sendAdminCredentials(newAdmin.email, password, newAdmin.name);

    await activityService.logActivity("STAFF", `New ${newAdmin.role} created: ${newAdmin.name}`, {
        adminId: superAdmin._id,
        targetTab: "staff",
        targetId: newAdmin._id
    });

    return {
        message: "Administrative account created and credentials sent to email.",
        admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email, role: newAdmin.role }
    };
};

const completeOnboarding = async (adminId, newPassword) => {
    const admin = await Admin.findById(adminId);
    if (!admin) throw new AppError("Staff account not found.", 404);
    if (!admin.isFirstLogin) throw new AppError("Account is already onboarded.", 400);

    admin.password = await bcrypt.hash(newPassword, 10);
    admin.isFirstLogin = false;
    const secretKey = generateSecretKey();
    admin.secretKey = secretKey;
    await admin.save();

    await activityService.logActivity("STAFF", `Admin onboarding completed: ${admin.name}`, {
        targetTab: "staff",
        targetId: admin._id
    });

    return {
        message: "Onboarding complete. SAVE YOUR SECURITY SECRET KEY!",
        secretKey,
        user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role }
    };
};

const getAllStaff = async () => {
    return await Admin.find().select("-password");
};

const getAllUsers = async () => {
    return await User.find({ role: "user" }).select("-password");
};

const approveAdmin = async (adminId) => {
    const admin = await Admin.findById(adminId);
    if (!admin) throw new AppError("Admin not found", 404);
    admin.isApproved = true;
    await admin.save();

    await activityService.logActivity("STAFF", `Admin account approved: ${admin.name}`, {
        targetTab: "staff",
        targetId: admin._id
    });

    return { message: "Admin approved" };
};

const getPendingAdmins = async () => {
    return await Admin.find({ role: "admin", isApproved: false });
};

module.exports = {
    generateSecretKey,
    generateOTP,
    generateToken,
    adminLogin,
    createStaff,
    completeOnboarding,
    getAllStaff,
    getAllUsers,
    approveAdmin,
    getPendingAdmins
};
