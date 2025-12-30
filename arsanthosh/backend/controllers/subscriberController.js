const Subscriber = require("../models/Subscriber");
const AppError = require("../utils/AppError");
const nodemailer = require("nodemailer");

// --- Helper: Send Email (Reusing logic if available, else simple implementation) ---
// Assuming standard Nodemailer setup from env
const sendEmail = async (options) => {
  // strict reuse of existing transporter if possible, but defining local for safety
  const transporter = nodemailer.createTransport({
    service: "gmail", // OR use process.env.EMAIL_SERVICE
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `Architect Santhosh <${process.env.EMAIL_USER}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  await transporter.sendMail(mailOptions);
};

// @desc    Subscribe to newsletter
// @route   POST /api/subscribers
// @access  Public
exports.subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;

    if (!email) {
      return next(new AppError("Please provide an email address", 400));
    }

    // Check if already subscribed
    let subscriber = await Subscriber.findOne({ email });

    if (subscriber) {
      if (subscriber.isSubscribed) {
        return res.status(200).json({
          success: true,
          message: "You are already subscribed!",
        });
      } else {
        // Resubscribe
        subscriber.isSubscribed = true;
        await subscriber.save();
        return res.status(200).json({
          success: true,
          message: "Welcome back! You have been successfully resubscribed.",
        });
      }
    }

    // Create new
    subscriber = await Subscriber.create({ email });

    // Optional: Send Welcome Email
    try {
      await sendEmail({
        to: email,
        subject: "Welcome to Architect Santhosh Newsletter",
        html: `
                    <h1>Welcome!</h1>
                    <p>Thank you for subscribing to our newsletter. You will be the first to know about our latest designs, products, and offers.</p>
                    <br>
                    <p>Regards,<br>Architect Santhosh Team</p>
                `,
      });
    } catch (err) {
      console.error("Welcome email failed", err);
      // Don't fail the request just because email failed
    }

    res.status(201).json({
      success: true,
      message: "Successfully subscribed!",
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all subscribers
// @route   GET /api/subscribers
// @access  Private (Admin)
exports.getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: subscribers.length,
      data: subscribers,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Send Bulk Email to Subscribers
// @route   POST /api/subscribers/send-update
// @access  Private (Admin)
exports.sendBulkEmail = async (req, res, next) => {
  try {
    const { subject, message, testEmail } = req.body; // Can allow sending test to self

    if (!subject || !message) {
      return next(new AppError("Subject and Message are required", 400));
    }

    // 1. Fetch Subscribers
    const subscribers = await Subscriber.find({ isSubscribed: true });

    if (subscribers.length === 0 && !testEmail) {
      return next(new AppError("No active subscribers found", 404));
    }

    // 2. Prepare List
    // If testEmail is provided, ONLY send to test email
    const recipientList = testEmail
      ? [testEmail]
      : subscribers.map((sub) => sub.email);

    // 3. Send Emails (Using Bcc for privacy or looping)
    // Using Bcc is safer for simple bulk to avoid exposing emails to everyone
    // For very large lists, a queue is better, but this suffices for now.

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `Architect Santhosh <${process.env.EMAIL_USER}>`,
      bcc: recipientList, // Blind Carbon Copy
      subject: subject,
      html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    ${message}
                    <hr style="margin-top: 30px; border: 0; border-top: 1px solid #eee;">
                    <p style="font-size: 12px; color: #888;">
                        You are receiving this because you subscribed to the Architect Santhosh newsletter.
                        <br>
                        Balaji Nagar, Muthanampalyam, Tirupur, Tamil Nadu
                    </p>
                </div>
            `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({
      success: true,
      message: `Email Sent Successfully to ${recipientList.length} recipients.`,
    });
  } catch (error) {
    next(error);
  }
};
