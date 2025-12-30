const Payment = require("../models/Payment");
const Order = require("../models/Order");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const activityService = require("../services/activityService");
const crypto = require("crypto");

// PayU Configuration
const PAYU_KEY = process.env.PAYU_KEY || "GtKFFx"; // Test Key
const PAYU_SALT = process.env.PAYU_SALT || "eCwWELxi"; // Test Salt
const PAYU_TEST_URL = "https://test.payu.in/_payment";
const PAYU_PROD_URL = "https://secure.payu.in/_payment";
const PAYU_URL =
  process.env.NODE_ENV === "production" ? PAYU_PROD_URL : PAYU_TEST_URL;

// Helper: Generate Hash
const generateHash = (params, salt) => {
  const hashString = `${params.key}|${params.txnid}|${params.amount}|${
    params.productinfo
  }|${params.firstname}|${params.email}|${params.udf1 || ""}|${
    params.udf2 || ""
  }|${params.udf3 || ""}|${params.udf4 || ""}|${
    params.udf5 || ""
  }||||||${salt}`;
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

const initiatePayment = catchAsync(async (req, res) => {
  const {
    amount,
    productinfo,
    firstname,
    email,
    phone,
    userId,
    address,
    cart,
  } = req.body;

  const txnid = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // 1. Create Pending Order
  if (cart && cart.length > 0) {
    await Order.create({
      orderId: `ORD-${Date.now()}`,
      userId: userId || null,
      customerName: firstname,
      email,
      phone,
      address: address || "Not Provided",
      items: cart.map((item) => ({
        productId: item._id || null, // Assuming cart item has _id if it's from DB
        name: item.name,
        quantity: item.quantity,
        price: parseFloat(item.price.replace(/[^\d.]/g, "")), // Clean price string
        image: item.image,
      })),
      totalAmount: amount,
      paymentMethod: "Card", // Defaulting to Card/NetBanking for PayU
      paymentStatus: "Pending",
      transactionId: txnid,
      orderStatus: "Pending",
    });
  }

  const params = {
    key: PAYU_KEY,
    txnid: txnid,
    amount: String(amount),
    productinfo: productinfo || "Store Purchase",
    firstname: firstname,
    email: email,
    phone: phone || "",
    surl: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/payment/success`, // Success URL
    furl: `${
      process.env.FRONTEND_URL || "http://localhost:3000"
    }/payment/failure`, // Failure URL
    curl: `${
      process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
    }/payments/webhook`,
    udf1: userId || "Guest",
  };

  const hash = generateHash(params, PAYU_SALT);

  // 2. Create Pending Payment Record
  await Payment.create({
    transactionId: txnid,
    amount,
    method: "PayU",
    status: "pending",
    customerName: firstname,
    userId: userId || null,
    type: "Product",
  });

  return ApiResponse.success(
    res,
    200,
    {
      action: PAYU_URL,
      params: { ...params, hash },
    },
    "Payment Initiated"
  );
});

const verifyPayment = catchAsync(async (req, res) => {
  const { txnid, amount, productinfo, firstname, email, status, hash, udf1 } =
    req.body;

  // Verify Hash (Reverse Hash)
  // salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashString = `${PAYU_SALT}|${status}||||||${
    udf1 || ""
  }|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  if (calculatedHash !== hash) {
    await Payment.findOneAndUpdate(
      { transactionId: txnid },
      { status: "failed" }
    );
    await Order.findOneAndUpdate(
      { transactionId: txnid },
      { paymentStatus: "Failed" }
    );
    return res.status(400).json({ success: false, message: "Invalid Hash" });
  }

  if (status === "success") {
    // Update Payment
    const payment = await Payment.findOneAndUpdate(
      { transactionId: txnid },
      { status: "verified" },
      { new: true }
    );

    // Update Order
    await Order.findOneAndUpdate(
      { transactionId: txnid },
      { paymentStatus: "Completed", orderStatus: "Pending" } // Keep order Pending for admin approval
    );

    if (payment) {
      await activityService.logActivity(
        "PAYMENT",
        `Transaction verified via Webhook: ${txnid} - ₹${amount}`,
        {
          adminId: null, // System event
          targetTab: "payments",
          targetId: payment._id,
        }
      );
    }
  } else {
    await Payment.findOneAndUpdate(
      { transactionId: txnid },
      { status: "failed" }
    );
    await Order.findOneAndUpdate(
      { transactionId: txnid },
      { paymentStatus: "Failed" }
    );
  }

  return res.status(200).json({ success: true, message: "Webhook Processed" });
});

// For Admin List
const getAllPayments = catchAsync(async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  return ApiResponse.success(
    res,
    200,
    payments,
    "Payments fetched successfully"
  );
});

const getMyPayments = catchAsync(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  return ApiResponse.success(
    res,
    200,
    payments,
    "My payments fetched successfully"
  );
});

module.exports = {
  initiatePayment,
  verifyPayment,
  getAllPayments,
  getMyPayments,
};
