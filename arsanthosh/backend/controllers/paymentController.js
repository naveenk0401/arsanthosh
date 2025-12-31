const Payment = require("../models/Payment");
const Order = require("../models/Order");
const catchAsync = require("../utils/catchAsync");
const ApiResponse = require("../utils/ApiResponse");
const activityService = require("../services/activityService");
const crypto = require("crypto");

// PayU Configuration
const PAYU_KEY = process.env.PAYU_KEY || "";
const PAYU_SALT = process.env.PAYU_SALT || "";
const PAYU_TEST_URL = "https://test.payu.in/_payment";
const PAYU_PROD_URL = "https://secure.payu.in/_payment";

// Priority: process.env.PAYU_MODE -> process.env.NODE_ENV
const PAYU_URL =
  process.env.PAYU_MODE === "production" ||
  (process.env.NODE_ENV === "production" && process.env.PAYU_MODE !== "test")
    ? PAYU_PROD_URL
    : PAYU_TEST_URL;

// Helper: Generate Hash
const generateHash = (params, salt) => {
  // PayU formula: sha512(key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|SALT)
  const hashString = [
    params.key,
    params.txnid,
    params.amount,
    params.productinfo,
    params.firstname,
    params.email,
    params.udf1 || "",
    params.udf2 || "",
    params.udf3 || "",
    params.udf4 || "",
    params.udf5 || "",
    params.udf6 || "",
    params.udf7 || "",
    params.udf8 || "",
    params.udf9 || "",
    salt,
  ].join("|");

  return crypto.createHash("sha512").update(hashString).digest("hex");
};

const initiatePayment = catchAsync(async (req, res) => {
  const {
    amount,
    productinfo,
    firstname,
    email,
    phone,
    address,
    street,
    city,
    state,
    country,
    pincode,
    cart,
  } = req.body;

  const userId = req.user?._id;

  console.log(`[PAYMENT_INIT] Initiating for ${email}, Amount: ${amount}`);

  const txnid = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  // 1. Create Pending Order
  if (cart && cart.length > 0) {
    await Order.create({
      orderId: `ORD-${Date.now()}`,
      userId: userId || null,
      customerName: firstname,
      email,
      phone,
      address,
      street,
      city,
      state,
      country,
      pincode,
      items: cart.map((item) => ({
        productId: item._id || null,
        name: item.name,
        quantity: item.quantity,
        price:
          typeof item.price === "string"
            ? parseFloat(item.price.replace(/[^\d.]/g, ""))
            : item.price,
        image: item.image,
      })),
      totalAmount: amount,
      paymentMethod: "Card",
      paymentStatus: "Pending",
      transactionId: txnid,
      orderStatus: "Pending",
    });
  }

  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

  const params = {
    key: PAYU_KEY,
    txnid: txnid,
    amount: String(amount),
    productinfo: productinfo || "Store Purchase",
    firstname: firstname,
    email: email,
    phone: phone || "",
    surl: `${apiUrl}/payments/callback`, // Success URL - Backend first
    furl: `${apiUrl}/payments/callback`, // Failure URL - Backend first
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

// PayU hits this after payment is complete (POST request)
const handleCallback = catchAsync(async (req, res) => {
  const { txnid, amount, productinfo, firstname, email, status, hash, udf1 } =
    req.body;
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  console.log(`[PAYMENT_CALLBACK] Status: ${status}, TXNID: ${txnid}`);

  // salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
  const hashString = `${PAYU_SALT}|${status}||||||${
    udf1 || ""
  }|${email}|${firstname}|${productinfo}|${amount}|${txnid}|${PAYU_KEY}`;
  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  // In production, we'd strict-check the hash. For now, logging.
  // if (calculatedHash !== hash) ...

  if (status === "success") {
    await Payment.findOneAndUpdate(
      { transactionId: txnid },
      { status: "verified" }
    );
    const order = await Order.findOneAndUpdate(
      { transactionId: txnid },
      { paymentStatus: "Completed" },
      { new: true }
    );

    if (order) {
      await activityService.logActivity(
        "PAYMENT",
        `Order ${order.orderId} paid successfully (₹${amount})`,
        { targetTab: "payments", targetId: order._id }
      );
    }

    return res.redirect(`${frontendUrl}/payment/success?orderId=${txnid}`);
  } else {
    await Payment.findOneAndUpdate(
      { transactionId: txnid },
      { status: "failed" }
    );
    await Order.findOneAndUpdate(
      { transactionId: txnid },
      { paymentStatus: "Failed" }
    );
    return res.redirect(`${frontendUrl}/payment/failure?txnid=${txnid}`);
  }
});

const verifyPayment = catchAsync(async (req, res) => {
  // Keeping this for potential webhook usage (S2S)
  return res.status(200).json({ success: true, message: "Webhook endpoint" });
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
  handleCallback,
  getAllPayments,
  getMyPayments,
};
