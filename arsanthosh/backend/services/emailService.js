const nodemailer = require("nodemailer");
const { otpTemplate, orderConfirmationTemplate, welcomeTemplate } = require("../utils/emailTemplates");

/**
 * Service to handle Email operations.
 * Optimized for scalability and professional communication.
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || "smtp.gmail.com",
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.from = process.env.EMAIL_FROM || '"Architect Santhosh" <noreply@arsanthosh.com>';
  }

  /**
   * Sends an OTP to the specified email.
   */
  async sendOTP(email, otp) {
    const mailOptions = {
      from: this.from,
      to: email,
      subject: `Verification Code: ${otp}`,
      html: otpTemplate(otp),
    };

    return this._send(mailOptions, `OTP sent to ${email}`);
  }

  /**
   * Sends a Welcome email to new customers.
   */
  async sendWelcomeEmail(email, userName) {
    const mailOptions = {
      from: this.from,
      to: email,
      subject: "Welcome to Architect Santhosh",
      html: welcomeTemplate(userName),
    };

    return this._send(mailOptions, `Welcome email sent to ${email}`);
  }

  /**
   * Sends an Order Confirmation email.
   * @param {string} email - Recipient email.
   * @param {Object} orderData - Data for the order template.
   */
  async sendOrderConfirmation(email, orderData) {
    const mailOptions = {
      from: this.from,
      to: email,
      subject: `Order Confirmed: #${orderData.orderId}`,
      html: orderConfirmationTemplate(orderData),
    };

    return this._send(mailOptions, `Order confirmation sent to ${email}`);
  }

  /**
   * Internal helper to send mail.
   */
  async _send(options, successLog) {
    try {
      const info = await this.transporter.sendMail(options);
      console.log(successLog, info.messageId);
      return info;
    } catch (error) {
      console.error("Email send error:", error);
      // In a real app, we might retry or use a queue
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
