const authService = require("../services/authService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");


const register = catchAsync(async (req, res) => {
    const result = await authService.register(req.body);
    return ApiResponse.success(res, 201, result, "Registration successful");
});

const login = catchAsync(async (req, res) => {
    const { email, password, secretKey } = req.body;
    const result = await authService.login(email, password, secretKey);
    return ApiResponse.success(res, 200, result, "Login successful");
});

const requestSecretReset = catchAsync(async (req, res) => {
    const { email, phone } = req.body;
    const result = await authService.requestSecretReset(email, phone);
    return ApiResponse.success(res, 200, result, "Secret reset requested");
});

const verifySecretReset = catchAsync(async (req, res) => {
    const { email, otp, newPassword } = req.body;
    const result = await authService.verifySecretResetAndGenerate(email, otp, newPassword);
    return ApiResponse.success(res, 200, result, "Secret verified and reset");
});

const verify = catchAsync(async (req, res) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOTP(email, otp);
    return ApiResponse.success(res, 200, result, "OTP verification successful");
});

const getPendingAdmins = catchAsync(async (req, res) => {
    const result = await authService.getPendingAdmins();
    return ApiResponse.success(res, 200, result, "Pending admins fetched successfully");
});

const approveAdmin = catchAsync(async (req, res) => {
    const { adminId } = req.params;
    const result = await authService.approveAdmin(adminId);
    return ApiResponse.success(res, 200, result, "Admin approved successfully");
});

const getUsers = catchAsync(async (req, res) => {
    const result = await authService.getAllUsers();
    return ApiResponse.success(res, 200, result, "Users fetched successfully");
});

const createStaff = catchAsync(async (req, res) => {
    const result = await authService.createAdmin(req.body, req.user._id);
    return ApiResponse.success(res, 201, result, "Staff created successfully");
});

const completeOnboarding = catchAsync(async (req, res) => {
    const { newPassword } = req.body;
    const result = await authService.completeOnboarding(req.user._id, newPassword);
    return ApiResponse.success(res, 200, result, "Onboarding complete");
});

const getStaff = catchAsync(async (req, res) => {
    const result = await authService.getAllStaff();
    return ApiResponse.success(res, 200, result, "Staff directory fetched");
});

module.exports = {
    register,
    login,
    requestSecretReset,
    verifySecretReset,
    verify,
    getPendingAdmins,
    approveAdmin,
    getUsers,
    createStaff,
    completeOnboarding,
    getStaff
};
