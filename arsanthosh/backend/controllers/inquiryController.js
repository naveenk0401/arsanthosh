const inquiryService = require("../services/inquiryService");

const catchAsync = fn => (req, res, next) => {
    fn(req, res, next).catch(next);
};

exports.createInquiry = catchAsync(async (req, res) => {
    // Public endpoint for "Contact Us" form
    const inquiry = await inquiryService.createInquiry(req.body);

    res.status(201).json({
        success: true,
        message: "Thank you for contacting us! We will get back to you shortly.",
        data: { id: inquiry._id } // Don't return full object for security/spam prevention
    });
});

exports.getInquiries = catchAsync(async (req, res) => {
    // Admin only
    const inquiries = await inquiryService.getInquiries(req.query);
    res.status(200).json({
        success: true,
        count: inquiries.length,
        data: inquiries
    });
});

exports.updateStatus = catchAsync(async (req, res) => {
    // Admin only
    const inquiry = await inquiryService.updateStatus(req.params.id, req.body.status);
    res.status(200).json({
        success: true,
        data: inquiry
    });
});
