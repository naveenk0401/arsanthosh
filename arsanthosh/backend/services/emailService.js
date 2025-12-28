const nodemailer = require("nodemailer");
const { otpTemplate, orderConfirmationTemplate, welcomeTemplate } = require("../utils/emailTemplates");

/**
 * Service to handle Email operations using Gmail SMTP.
 */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

const from = process.env.EMAIL_FROM || process.env.SMTP_USER;

const _send = async (options, successLog) => {
  try {
    const mailOptions = {
      from,
      to: options.to,
      subject: options.subject,
      html: options.html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(successLog, info.messageId);
    return info;
  } catch (error) {
    console.error("Email send error:", error);
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

const sendOTP = async (email, otp) => {
  return _send({
    to: email,
    subject: `Verification Code: ${otp}`,
    html: otpTemplate(otp),
  }, `OTP sent to ${email}`);
};

const sendWelcomeEmail = async (email, userName) => {
  return _send({
    to: email,
    subject: "Welcome to Architect Santhosh",
    html: welcomeTemplate(userName),
  }, `Welcome email sent to ${email}`);
};

const sendOrderConfirmation = async (email, orderData) => {
  return _send({
    to: email,
    subject: `Order Confirmed: #${orderData.orderId}`,
    html: orderConfirmationTemplate(orderData),
  }, `Order confirmation sent to ${email}`);
};

const sendAdminCredentials = async (email, password, name) => {
  const { adminCredentialsTemplate } = require("../utils/emailTemplates");
  return _send({
    to: email,
    subject: "Your Admin Portal Credentials - Architect Santhosh",
    html: adminCredentialsTemplate(name, email, password),
  }, `Admin credentials sent to ${email}`);
};

module.exports = {
  sendOTP,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendAdminCredentials,
  _send
};
