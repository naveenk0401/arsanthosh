const authService = require("../services/authService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");


class AuthController {
    register = catchAsync(async (req, res) => {
        const result = await authService.register(req.body);
        return ApiResponse.success(res, 201, result, "Registration successful");
    });

    login = catchAsync(async (req, res) => {
        const { email, password, secretKey } = req.body;
        const result = await authService.login(email, password, secretKey);
        return ApiResponse.success(res, 200, result, "Auth handled successfully");
    });

    requestSecretReset = catchAsync(async (req, res) => {
        const { email, phone } = req.body;
        const result = await authService.requestSecretReset(email, phone);
        return ApiResponse.success(res, 200, result);
    });

    verifySecretReset = catchAsync(async (req, res) => {
        const { email, otp, newPassword } = req.body;
        const result = await authService.verifySecretResetAndGenerate(email, otp, newPassword);
        return ApiResponse.success(res, 200, result);
    });

    verify = catchAsync(async (req, res) => {
        const { email, otp } = req.body;
        const result = await authService.verifyOTP(email, otp);
        return ApiResponse.success(res, 200, result, "Verification successful");
    });

    getPendingAdmins = catchAsync(async (req, res) => {
        const result = await authService.getPendingAdmins();
        return ApiResponse.success(res, 200, result, "Pending admins fetched successfully");
    });

    approveAdmin = catchAsync(async (req, res) => {
        const { adminId } = req.params;
        const result = await authService.approveAdmin(adminId);
        return ApiResponse.success(res, 200, result, "Admin approved successfully");
    });

    getUsers = catchAsync(async (req, res) => {
        const result = await authService.getAllUsers();
        return ApiResponse.success(res, 200, result, "Users fetched successfully");
    });

    createStaff = catchAsync(async (req, res) => {
        const result = await authService.createAdmin(req.body, req.user._id);
        return ApiResponse.success(res, 201, result, "Staff created successfully");
    });

    completeOnboarding = catchAsync(async (req, res) => {
        const { newPassword } = req.body;
        const result = await authService.completeOnboarding(req.user._id, newPassword);
        return ApiResponse.success(res, 200, result, "Onboarding complete");
    });

    getStaff = catchAsync(async (req, res) => {
        const result = await authService.getAllStaff();
        return ApiResponse.success(res, 200, result, "Staff directory fetched");
    });
}

module.exports = new AuthController();
