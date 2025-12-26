const { Resend } = require("resend");
const { otpTemplate, orderConfirmationTemplate, welcomeTemplate } = require("../utils/emailTemplates");

/**
 * Service to handle Email operations using Resend API.
 * Optimized for reliability and modern cloud environments.
 */
class EmailService {
  constructor() {
    // If you don't have an API key yet, it will use the RESEND_API_KEY from .env
    this.resend = new Resend(process.env.RESEND_API_KEY || "re_123456789");

    // Default verified sender - Resend requires a verified domain or "onboarding@resend.dev" for testing
    this.from = process.env.EMAIL_FROM || "onboarding@resend.dev";
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
   * Internal helper to send mail via Resend API.
   */
  async _send(options, successLog) {
    try {
      const { data, error } = await this.resend.emails.send({
        from: this.from,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      if (error) {
        throw new Error(error.message);
      }

      console.log(successLog, data.id);
      return data;
    } catch (error) {
      console.error("Email send error:", error);
      // Fallback/Log the error but don't strictly crash the auth flow if email fails during testing
      // Remove the throw below if you want registration to succeed even if email fails
      throw new Error(`Email delivery failed: ${error.message}`);
    }
  }
}

module.exports = new EmailService();
