const { google } = require("googleapis");
const {
  otpTemplate,
  orderConfirmationTemplate,
  welcomeTemplate,
  adminCredentialsTemplate,
} = require("../utils/emailTemplates");

/**
 * Service to handle Email operations using Gmail API with OAuth2.
 */
const createGmailClient = async () => {
  const clientId = process.env.GMAIL_CLIENT_ID;
  const clientSecret = process.env.GMAIL_CLIENT_SECRET;
  const refreshToken = process.env.GMAIL_REFRESH_TOKEN;

  if (!clientId || !clientSecret || !refreshToken) {
    const missing = [];
    if (!clientId) missing.push("GMAIL_CLIENT_ID");
    if (!clientSecret) missing.push("GMAIL_CLIENT_SECRET");
    if (!refreshToken) missing.push("GMAIL_REFRESH_TOKEN");
    throw new Error(
      `Missing Gmail API credentials: ${missing.join(
        ", "
      )}. Please add them to your environment variables.`
    );
  }

  const oauth2Client = new google.auth.OAuth2(
    clientId,
    clientSecret,
    "https://developers.google.com/oauthplayground"
  );

  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    // Explicitly refresh the token to ensure it's valid before passing to Gmail client
    await oauth2Client.getAccessToken();
  } catch (error) {
    console.error("Failed to refresh Gmail access token:", error.message);
    throw new Error(`Gmail Authentication failed: ${error.message}`);
  }

  return google.gmail({ version: "v1", auth: oauth2Client });
};

const _send = async (options, successLog) => {
  try {
    const gmail = await createGmailClient();

    // Create RFC 2822 formatted email
    const subject = options.subject;
    const to = options.to;
    const from = process.env.EMAIL_FROM || process.env.GMAIL_USER_EMAIL;
    const html = options.html;

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString(
      "base64"
    )}?=`;
    const messageParts = [
      `From: ${from}`,
      `To: ${to}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      "",
      html,
    ];
    const message = messageParts.join("\n");

    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log(successLog, res.data.id);
    return res.data;
  } catch (error) {
    console.error(
      "Gmail API send error FULL:",
      error.message || JSON.stringify(error)
    );
    throw new Error(`Email delivery failed: ${error.message}`);
  }
};

const sendOTP = async (email, otp) => {
  return _send(
    {
      to: email,
      subject: `Verification Code: ${otp}`,
      html: otpTemplate(otp),
    },
    `OTP sent to ${email}`
  );
};

const sendWelcomeEmail = async (email, userName) => {
  return _send(
    {
      to: email,
      subject: "Welcome to Architect Santhosh",
      html: welcomeTemplate(userName),
    },
    `Welcome email sent to ${email}`
  );
};

const sendOrderConfirmation = async (email, orderData) => {
  return _send(
    {
      to: email,
      subject: `Order Confirmed: #${orderData.orderId}`,
      html: orderConfirmationTemplate(orderData),
    },
    `Order confirmation sent to ${email}`
  );
};

const sendAdminCredentials = async (email, password, name) => {
  return _send(
    {
      to: email,
      subject: "Your Admin Portal Credentials - Architect Santhosh",
      html: adminCredentialsTemplate(name, email, password),
    },
    `Admin credentials sent to ${email}`
  );
};

module.exports = {
  sendOTP,
  sendWelcomeEmail,
  sendOrderConfirmation,
  sendAdminCredentials,
  _send,
};
