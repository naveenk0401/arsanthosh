const nodemailer = require("nodemailer");
const { otpTemplate, orderConfirmationTemplate, welcomeTemplate } = require("../utils/emailTemplates");

/**
 * Service to handle Email operations using Gmail SMTP.
 */
class EmailService {
  constructor() {
    this.transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    this.from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  }

  /**
   * Sends an OTP to the specified email.
   */
  async sendOTP(email, otp) {
    return this._send({
      to: email,
      subject: `Verification Code: ${otp}`,
      html: otpTemplate(otp),
    }, `OTP sent to ${email}`);
  }

  /**
   * Sends a Welcome email to new customers.
   */
  async sendWelcomeEmail(email, userName) {
    return this._send({
      to: email,
      subject: "Welcome to Architect Santhosh",
      html: welcomeTemplate(userName),
    }, `Welcome email sent to ${email}`);
  }

  /**
   * Sends an Order Confirmation email.
   */
  async sendOrderConfirmation(email, orderData) {
    return this._send({
      to: email,
      subject: `Order Confirmed: #${orderData.orderId}`,
      html: orderConfirmationTemplate(orderData),
    }, `Order confirmation sent to ${email}`);
  }

  /**
   * Internal helper to send mail via NodeMailer.
   */
  async _send(options, successLog) {
    try {
      const mailOptions = {
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      };

      const info = await this.transporter.sendMail(mailOptions);
      console.log(successLog, info.messageId);
      return info;
    } catch (error) {
      console.error("Email send error:", error);
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
