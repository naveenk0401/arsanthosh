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
const generateSecretKey = () => {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";
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

const register = async (userData) => {
  const { name, email, password, phone } = userData;
  const normalizedEmail = email.toLowerCase().trim();

  const userExists = await User.findOne({ email: normalizedEmail });
  if (userExists) {
    throw new AppError("User already exists", 400);
  }

  const otp = generateOTP();
  const hashedPassword = await bcrypt.hash(password, 10);

  let finalRole = "user";
  let isApproved = true;

  if (userData.adminToken === "ARS-SUPER-2025") {
    finalRole = "super-admin";
    isApproved = true;
  } else if (userData.adminToken === "ARS-ADMIN-2025") {
    finalRole = "admin";
    isApproved = false;
  }

  const newUserPayload = {
    name,
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    role: finalRole,
    isApproved,
    isVerified: true,
  };

  await OTP.findOneAndUpdate(
    { email: normalizedEmail },
    { otp, userData: newUserPayload },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await emailService.sendOTP(normalizedEmail, otp);

  return {
    message: "OTP sent to email. Please verify to complete registration.",
    email: normalizedEmail,
  };
};

const verifyOTP = async (email, otp) => {
  const normalizedEmail = email.toLowerCase().trim();

  const otpRecord = await OTP.findOne({ email: normalizedEmail, otp });
  if (!otpRecord) {
    throw new AppError("Invalid or expired OTP", 400);
  }

  const user = await User.create(otpRecord.userData);

  await OTP.deleteOne({ _id: otpRecord._id });

  let secretKey = null;
  if (user.role === "super-admin" || user.role === "admin") {
    secretKey = generateSecretKey();
    user.secretKey = secretKey;
    await user.save();
  }

  if (user.role === "user") {
    emailService.sendWelcomeEmail(user.email, user.name).catch(console.error);
  }

  if (user.role === "admin") {
    return {
      message:
        "Email verified successfully. Your admin account is now pending super-admin approval.",
      isApproved: false,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  return {
    message:
      user.role === "super-admin" || user.role === "admin"
        ? "Verification successful. SAVE YOUR SECRET KEY!"
        : "Verification successful",
    secretKey: secretKey || undefined,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token:
      user.role === "super-admin" || user.isApproved
        ? generateToken(user._id)
        : null,
  };
};

const login = async (email, password, secretKeyInput) => {
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    throw new AppError("Invalid email or password", 401);
  }

  if (!user.isApproved) {
    throw new AppError("Your account is pending approval.", 403);
  }

  if (user.role === "super-admin" || user.role === "admin") {
    if (user.role === "admin" && user.isFirstLogin) {
      return {
        message: "First login successful. Password update required.",
        isFirstLogin: true,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
        token: generateToken(user._id),
      };
    }

    if (!secretKeyInput) {
      throw new AppError(
        "Administrative login requires your 12-digit Security Secret Key",
        401
      );
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
    token: generateToken(user._id),
  };
};

const requestSecretReset = async (email) => {
  const user = await User.findOne({ email, role: "super-admin" });
  if (!user) throw new AppError("No Super Admin found with this email", 404);

  const otp = generateOTP();
  user.secretResetOtp = otp;
  user.secretResetExpires = new Date(Date.now() + 10 * 60 * 1000);
  await user.save();

  await emailService.sendOTP(email, otp);
  return { message: "Security override OTP sent to your verified email." };
};

const verifySecretResetAndGenerate = async (email, otp, newPassword) => {
  const user = await User.findOne({
    email,
    secretResetOtp: otp,
    secretResetExpires: { $gt: Date.now() },
    role: "super-admin",
  });

  if (!user) throw new AppError("Invalid or expired reset OTP", 400);

  if (newPassword) {
    user.password = await bcrypt.hash(newPassword, 10);
  }
  const newSecretKey = generateSecretKey();
  user.secretKey = newSecretKey;
  user.secretResetOtp = undefined;
  user.secretResetExpires = undefined;

  await user.save();

  return {
    message:
      "Password updated and new Security Secret generated. Please save it securely.",
    newSecretKey,
  };
};

const approveAdmin = async (adminId) => {
  const admin = await User.findById(adminId);
  if (!admin) throw new AppError("Admin not found", 404);
  admin.isApproved = true;
  await admin.save();

  await activityService.logActivity(
    "STAFF",
    `Admin account approved: ${admin.name} (${admin.email})`,
    {
      targetTab: "staff",
      targetId: admin._id,
    }
  );

  return { message: "Admin approved" };
};

const getPendingAdmins = async () => {
  return await User.find({
    role: "admin",
    isApproved: false,
    isVerified: true,
  });
};

const getAllUsers = async () => {
  return await User.find({ role: "user" }).select("-password -otp -otpExpires");
};

const createAdmin = async (adminData, adminId) => {
  const superAdmin = await User.findById(adminId);
  if (!superAdmin || superAdmin.role !== "super-admin") {
    throw new AppError(
      "Only Super Admins can create administrative staff.",
      403
    );
  }

  const { name, email, password, phone, dob, idProofType, idProofNumber } =
    adminData;

  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists)
    throw new AppError("User with this email already exists.", 400);

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
    isFirstLogin: true,
  });

  await emailService.sendAdminCredentials(
    newAdmin.email,
    password,
    newAdmin.name
  );

  await activityService.logActivity(
    "STAFF",
    `New Admin created: ${newAdmin.name}`,
    {
      adminId: superAdmin._id,
      targetTab: "staff",
      targetId: newAdmin._id,
    }
  );

  return {
    message: "Administrative account created and credentials sent to email.",
    admin: { id: newAdmin._id, name: newAdmin.name, email: newAdmin.email },
  };
};

const completeOnboarding = async (adminId, newPassword) => {
  const admin = await User.findById(adminId);
  if (!admin) throw new AppError("Staff account not found.", 404);
  if (!admin.isFirstLogin)
    throw new AppError("Account is already onboarded.", 400);

  admin.password = await bcrypt.hash(newPassword, 10);
  admin.isFirstLogin = false;
  const secretKey = generateSecretKey();
  admin.secretKey = secretKey;
  await admin.save();

  await activityService.logActivity(
    "STAFF",
    `Admin onboarding completed: ${admin.name}`,
    {
      targetTab: "staff",
      targetId: admin._id,
    }
  );

  return {
    message: "Onboarding complete. SAVE YOUR SECURITY SECRET KEY!",
    secretKey,
    user: {
      id: admin._id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    },
  };
};

const getAllStaff = async () => {
  return await User.find({ role: { $in: ["admin", "super-admin"] } }).select(
    "-password"
  );
};

module.exports = {
  generateSecretKey,
  generateOTP,
  generateToken,
  register,
  verifyOTP,
  login,
  requestSecretReset,
  verifySecretResetAndGenerate,
  approveAdmin,
  getPendingAdmins,
  getAllUsers,
  createAdmin,
  completeOnboarding,
  getAllStaff,
};
