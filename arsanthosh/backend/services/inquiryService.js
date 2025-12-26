const Inquiry = require("../models/Inquiry");
const emailService = require("./emailService");
const AppError = require("../utils/AppError");

/**
 * Service to handle Inquiry Business Logic.
 * Bridges the Database and Email Notification systems.
 */
class InquiryService {
    /**
     * Creates a new inquiry and notifies the admin.
     * @param {Object} data - The inquiry data (name, email, message, etc.)
     */
    async createInquiry(data) {
        // 1. Save to Database
        const inquiry = await Inquiry.create(data);

        // 2. Send Notification Email to Admin (Async - don't block response)
        // Note: In a real app, you might want to queue this or handle failures more robustly.
        this._sendAdminNotification(inquiry).catch(err =>
            console.error("Failed to send inquiry notification email:", err)
        );

        return inquiry;
    }

    /**
     * Retrieves inquiries with optional filtering and pagination.
     */
    async getInquiries(query) {
        // Basic filtering for now, can be expanded for pagination
        const filter = {};
        if (query.status) filter.status = query.status;

        return await Inquiry.find(filter).sort("-createdAt");
    }

    /**
     * Updates the status of an inquiry (e.g., New -> Contacted).
     */
    async updateStatus(id, status) {
        const inquiry = await Inquiry.findByIdAndUpdate(
            id,
            { status },
            { new: true, runValidators: true }
        );

        if (!inquiry) throw new AppError("Inquiry not found", 404);
        return inquiry;
    }

    /**
     * Private helper to format and send the email.
     */
    async _sendAdminNotification(inquiry) {
        // We'll send this TO the admin (or the EMAIL_FROM address for now as a self-notification)
        // In the future, this should go to a specific admin email env var.
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
    }
}

module.exports = new InquiryService();
