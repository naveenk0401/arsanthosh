const inquiryService = require("../services/inquiryService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

const createInquiry = catchAsync(async (req, res) => {
    // Public endpoint for "Contact Us" form
    const inquiry = await inquiryService.createInquiry(req.body);
    return ApiResponse.success(res, 201, { id: inquiry._id }, "Thank you for contacting us! We will get back to you shortly.");
});

const getInquiries = catchAsync(async (req, res) => {
    // Admin only
    const inquiries = await inquiryService.getInquiries(req.query);
    return ApiResponse.success(res, 200, inquiries, "Inquiries fetched successfully");
});

const updateStatus = catchAsync(async (req, res) => {
    // Admin only
    const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status);
    return ApiResponse.success(res, 200, inquiry, "Status updated successfully");
});

module.exports = {
    createInquiry,
    getInquiries,
    updateStatus
};
