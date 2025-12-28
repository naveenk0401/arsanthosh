const Inquiry = require("../models/Inquiry");
const emailService = require("./emailService");
const AppError = require("../utils/AppError");
const activityService = require("./activityService");

/**
 * Service to handle Inquiry Business Logic.
 * Bridges the Database and Email Notification systems.
 */
const _sendAdminNotification = async (inquiry) => {
    const adminEmail = process.env.EMAIL_FROM;
    const subject = `New Inquiry: ${inquiry.serviceType} from ${inquiry.name}`;
    const html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${inquiry.name}</p>
        <p><strong>Email:</strong> ${inquiry.email}</p>
        <p><strong>Phone:</strong> ${inquiry.phone || "N/A"}</p>
        <p><strong>Service:</strong> ${inquiry.serviceType}</p>
        <hr />
        <p><strong>Message:</strong></p>
        <p>${inquiry.message}</p>
        <br />
        <a href="https://arsanthosh.onrender.com/admin/inquiries">View in Dashboard</a>
    `;

    await emailService._send({
        to: adminEmail,
        subject,
        html
    }, `Inquiry notification sent to ${adminEmail}`);
};

const createInquiry = async (data) => {
    const inquiry = await Inquiry.create(data);

    await activityService.logActivity("INQUIRY", `New consultation request from ${inquiry.name} (${inquiry.serviceType})`, {
        targetTab: "inquiries",
        targetId: inquiry._id
    });

    _sendAdminNotification(inquiry).catch(err =>
        console.error("Failed to send inquiry notification email:", err)
    );

    return inquiry;
};

const getInquiries = async (query) => {
    const filter = {};
    if (query.status) filter.status = query.status;
    return await Inquiry.find(filter).sort("-createdAt");
};

const updateStatus = async (id, status) => {
    const inquiry = await Inquiry.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
    );

    if (!inquiry) throw new AppError("Inquiry not found", 404);
    return inquiry;
};

module.exports = {
    createInquiry,
    getInquiries,
    updateStatus
};
