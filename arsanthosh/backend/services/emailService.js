const nodemailer = require("nodemailer");

/**
 * Service to handle Email operations.
 * Optimized for scalability and future SMTP provider switches.
 */
class EmailService {
    constructor() {
        // For development, we use ethereal or local SMTP logic
        // In production, user will update .env with real SMTP details
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST || "smtp.ethereal.email",
            port: process.env.SMTP_PORT || 587,
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    /**
     * Sends an OTP to the specified email.
     * @param {string} email - Recipient email.
     * @param {string} otp - Generated verification code.
     */
    async sendOTP(email, otp) {
        const mailOptions = {
            from: '"Architect Santhosh Support" <support@arsanthosh.com>',
            to: email,
            subject: "Verification Code - Architect Santhosh",
            html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee;">
            <h2 style="color: #c5a059; text-align: center;">Verify Your Account</h2>
            <p>Thank you for choosing Architect Santhosh. Please use the following One-Time Password (OTP) to complete your registration:</p>
            <div style="background: #f9f9f9; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #111;">
              ${otp}
            </div>
            <p style="color: #666; font-size: 12px; margin-top: 30px;">
              This code is valid for 10 minutes. If you did not request this, please ignore this email.
            </p>
          </div>
        `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`);
        } catch (error) {
            console.error("Error sending email:", error);
            throw new Error("Failed to send verification email.");
        }
    }
}

module.exports = new EmailService();
