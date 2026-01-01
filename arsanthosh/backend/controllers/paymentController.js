const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

/* ================= PAYU CONFIG ================= */
const PAYU_KEY = process.env.PAYU_KEY?.trim();
const PAYU_SALT = process.env.PAYU_SALT?.trim();
const PAYU_MODE = (process.env.PAYU_MODE || "test").toLowerCase();

const PAYU_URL =
  PAYU_MODE === "production"
    ? "https://secure.payu.in/_payment"
    : "https://test.payu.in/_payment";

/* ================= HASH GENERATORS ================= */

/**
 * INITIATE HASH (5 UDFs – CORRECT PAYU FORMAT)
 * key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5||||||SALT
 */
const generateInitiateHash = (p) => {
  const hashString =
    `${p.key}|${p.txnid}|${p.amount}|${p.productinfo}|` +
    `${p.firstname}|${p.email}|` +
    `${p.udf1 || ""}|${p.udf2 || ""}|${p.udf3 || ""}|${p.udf4 || ""}|${
      p.udf5 || ""
    }` +
    `||||||${PAYU_SALT}`;

  console.log("PAYU INIT HASH STRING >>>", hashString);

  return crypto.createHash("sha512").update(hashString).digest("hex");
};

/**
 * RESPONSE / WEBHOOK HASH (CORRECT PAYU TEST FORMAT)
 * salt|status||||||udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
const verifyResponseHash = (body) => {
  const hashString =
    `${PAYU_SALT}|${body.status}||||||` +
    `${body.udf5 || ""}|${body.udf4 || ""}|${body.udf3 || ""}|` +
    `${body.udf2 || ""}|${body.udf1 || ""}|` +
    `${body.email}|${body.firstname}|${body.productinfo}|` +
    `${body.amount}|${body.txnid}|${body.key}`;

  console.log("PAYU RESPONSE HASH STRING >>>", hashString);

  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  console.log("CALCULATED HASH:", calculatedHash);
  console.log("RECEIVED HASH:", body.hash);

  return calculatedHash === body.hash;
};

/* ================= INITIATE PAYMENT ================= */
exports.initiatePayment = catchAsync(async (req, res, next) => {
  const { orderId, amount, customerName, email, phone, productInfo } = req.body;

  if (!orderId || !amount || !customerName || !email) {
    return next(new AppError("Missing required fields", 400));
  }

  if (!PAYU_KEY || !PAYU_SALT) {
    return next(new AppError("PayU credentials missing", 500));
  }

  const formattedAmount = Number(amount).toFixed(2);
  const txnid = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

  const paymentParams = {
    key: PAYU_KEY,
    txnid,
    amount: formattedAmount,
    productinfo: productInfo.trim(), // ❗ NO lowercase
    firstname: customerName.trim(), // ❗ NO lowercase
    email: email.trim(), // ❗ NO lowercase
    phone: phone || "",

    udf1: orderId,
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
  };

  const hash = generateInitiateHash(paymentParams);

  await Payment.create({
    orderId,
    txnid,
    amount: formattedAmount,
    status: "pending",
    customerName,
    userId: req.user?._id || null,
  });

  const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:5000/api";

  return ApiResponse.success(
    res,
    200,
    {
      action: PAYU_URL,
      method: "POST",
      formData: {
        ...paymentParams,
        hash,
        surl: `${BACKEND_URL}/payments/callback`,
        furl: `${BACKEND_URL}/payments/callback`,
        service_provider: "payu_paisa",
      },
    },
    "Payment initiated"
  );
});

/* ================= CALLBACK ================= */
exports.handleCallback = catchAsync(async (req, res) => {
  const body = { ...req.body, ...req.query };
  const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

  console.log("🔥 PAYU CALLBACK HIT 🔥", body);

  if (!verifyResponseHash(body)) {
    return res.redirect(`${FRONTEND_URL}/payment/failure?error=hash_mismatch`);
  }

  const payment = await Payment.findOne({ txnid: body.txnid });
  const success = body.status === "success";

  if (payment) {
    payment.status = success ? "success" : "failed";
    payment.payuTxnId = body.mihpayid;
    payment.fullPayuResponse = body;
    await payment.save();

    await Order.findOneAndUpdate(
      { orderId: payment.orderId },
      {
        paymentStatus: success ? "Completed" : "Failed",
        transactionId: body.txnid,
      }
    );
  }

  return res.redirect(
    `${FRONTEND_URL}/payment/${success ? "success" : "failure"}?txnid=${
      body.txnid
    }`
  );
});

/* ================= WEBHOOK ================= */
exports.handleWebhook = catchAsync(async (req, res, next) => {
  console.log("🔥 PAYU WEBHOOK HIT 🔥", req.body);

  if (!verifyResponseHash(req.body)) {
    return next(new AppError("Invalid webhook hash", 400));
  }

  const { txnid, status, mihpayid } = req.body;
  const success = status === "success";

  const payment = await Payment.findOne({ txnid });
  if (payment && payment.status !== "success") {
    payment.status = success ? "success" : "failed";
    payment.payuTxnId = mihpayid;
    payment.fullPayuResponse = req.body;
    await payment.save();

    await Order.findOneAndUpdate(
      { orderId: payment.orderId },
      {
        paymentStatus: success ? "Completed" : "Failed",
        transactionId: txnid,
      }
    );
  }

  return ApiResponse.success(res, 200, null, "Webhook processed");
});

/* ================= GET PAYMENTS ================= */
exports.getAllPayments = catchAsync(async (req, res) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, payments, "Payments fetched");
});

exports.getMyPayments = catchAsync(async (req, res) => {
  const payments = await Payment.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  return ApiResponse.success(res, 200, payments, "My payments fetched");
});
