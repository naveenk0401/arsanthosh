const crypto = require("crypto");
const Payment = require("../models/Payment");
const Order = require("../models/Order");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/AppError");

// PayU Configuration
const PAYU_KEY = process.env.PAYU_KEY?.trim();
const PAYU_SALT = process.env.PAYU_SALT?.trim();
const PAYU_MODE = (process.env.PAYU_MODE || "test").toLowerCase();
const PAYU_URL =
  PAYU_MODE === "production"
    ? "https://secure.payu.in/_payment"
    : "https://test.payu.in/_payment";

/**
 * Helper: Generate SHA-512 Hash for Payment Initiation
 * Sequence: key|txnid|amount|productinfo|firstname|email|udf1|udf2|udf3|udf4|udf5|udf6|udf7|udf8|udf9|udf10|salt
 */
const generateInitiateHash = (params) => {
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
    params.udf10 || "",
    PAYU_SALT,
  ].join("|");
  return crypto.createHash("sha512").update(hashString).digest("hex");
};

/**
 * Helper: Verify SHA-512 Hash for Payment Response (Reverse Hash)
 * Sequence: salt|status|udf10|udf9|udf8|udf7|udf6|udf5|udf4|udf3|udf2|udf1|email|firstname|productinfo|amount|txnid|key
 */
const verifyResponseHash = (body) => {
  const hashString = [
    PAYU_SALT,
    body.status,
    body.udf10 || "",
    body.udf9 || "",
    body.udf8 || "",
    body.udf7 || "",
    body.udf6 || "",
    body.udf5 || "",
    body.udf4 || "",
    body.udf3 || "",
    body.udf2 || "",
    body.udf1 || "",
    body.email,
    body.firstname,
    body.productinfo,
    body.amount,
    body.txnid,
    body.key,
  ].join("|");

  console.log(`[PAYU_VERIFY_HASH_STRING] >>>${hashString}<<<`);
  const calculatedHash = crypto
    .createHash("sha512")
    .update(hashString)
    .digest("hex");

  console.log(
    `[PAYU_VERIFY_HASH] Calculated: ${calculatedHash}, Received: ${body.hash}`
  );
  return calculatedHash === body.hash;
};

/**
 * Initiate Payment
 * POST /api/payments/initiate
 */
const initiatePayment = catchAsync(async (req, res, next) => {
  const { orderId, amount, customerName, email, phone, productInfo } = req.body;

  if (!orderId || !customerName || !email || !amount) {
    return next(new AppError("Please provide all required fields", 400));
  }

  if (!PAYU_KEY || !PAYU_SALT) {
    return next(new AppError("PayU Credentials missing in environment", 500));
  }

  const formattedAmount = parseFloat(amount).toFixed(2);
  const txnid = `TXN_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
  const pInfo = (productInfo || `Order ${orderId}`).trim();
  const fName = customerName.trim();
  const mEmail = email.trim();

  const paymentParams = {
    key: PAYU_KEY,
    txnid,
    amount: formattedAmount,
    productinfo: pInfo,
    firstname: fName,
    email: mEmail,
    phone: (phone || "").trim(),
    udf1: orderId,
    udf2: "",
    udf3: "",
    udf4: "",
    udf5: "",
    udf6: "",
    udf7: "",
    udf8: "",
    udf9: "",
    udf10: "",
  };

  const hash = generateInitiateHash(paymentParams);

  // Create Pending Payment Record
  await Payment.create({
    orderId,
    txnid,
    amount: parseFloat(formattedAmount),
    status: "pending",
    customerName: fName,
    userId: req.user?._id || null,
  });

  const bUrl = process.env.BACKEND_URL || "http://localhost:5000/api";

  const formData = {
    ...paymentParams,
    hash,
    surl: `${bUrl}/payments/callback`,
    furl: `${bUrl}/payments/callback`,
    service_provider: "payu_paisa",
  };

  console.log(`[PAYU_INIT] TXNID: ${txnid}, Amount: ${formattedAmount}`);

  return ApiResponse.success(
    res,
    200,
    { action: PAYU_URL, formData },
    "Payment initiation successful"
  );
});

/**
 * Handle browser callback (Redirection)
 * POST /api/payments/callback
 */
const handleCallback = catchAsync(async (req, res, next) => {
  const body = { ...req.body, ...req.query };
  const { status, txnid } = body;
  const fUrl = process.env.FRONTEND_URL || "http://localhost:3000";

  console.log(
    `[PAYU_CALLBACK] Received for TXNID: ${txnid}, Status: ${status} (Method: ${req.method})`
  );
  console.log("[PAYU_CALLBACK_FULL_BODY] Keys:", Object.keys(body));

  if (!verifyResponseHash(body)) {
    console.error(`[PAYU_CALLBACK] Hash Mismatch!`);
    // On GET mismatch, check if we at least have txnid to try and rescue the status?
    // For now, let's keep it strict but informative.
    return res.redirect(
      `${fUrl}/payment/failure?txnid=${txnid || "error"}&error=hash_mismatch`
    );
  }

  // Update Status in DB (Fallback/Sync)
  const payment = await Payment.findOne({ txnid });
  const isSuccess = status && status.toLowerCase() === "success";

  if (payment) {
    payment.status = isSuccess ? "success" : "failed";
    payment.payuTxnId = req.body.mihpayid;
    payment.fullPayuResponse = req.body;
    await payment.save();

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId: payment.orderId },
      {
        paymentStatus: isSuccess ? "Completed" : "Failed",
        transactionId: txnid,
      },
      { new: true }
    );

    if (updatedOrder) {
      console.log(
        `[PAYU_CALLBACK] Updated Order ${payment.orderId} to ${updatedOrder.paymentStatus}`
      );
    } else {
      console.error(
        `[PAYU_CALLBACK] Order ${payment.orderId} NOT FOUND during update!`
      );
    }
  } else {
    console.error(
      `[PAYU_CALLBACK] Payment record NOT FOUND for TXNID: ${txnid}`
    );

    // Attempt emergency order update if orderId is in body (PayU sometimes sends it in udf fields)
    const possibleOrderId = req.body.udf1 || req.body.udf2; // Check if we stored it there
    if (possibleOrderId && possibleOrderId.startsWith("ORD-")) {
      await Order.findOneAndUpdate(
        { orderId: possibleOrderId },
        {
          paymentStatus: isSuccess ? "Completed" : "Failed",
          transactionId: txnid,
        }
      );
    }
  }

  if (status === "success") {
    return res.redirect(`${fUrl}/payment/success?txnid=${txnid}`);
  } else {
    return res.redirect(`${fUrl}/payment/failure?txnid=${txnid}`);
  }
});

/**
 * PayU Webhook
 * POST /api/payments/webhook
 */
const handleWebhook = catchAsync(async (req, res, next) => {
  const { txnid, status, amount, mihpayid } = req.body;

  console.log(`[PAYU_WEBHOOK] Received for TXNID: ${txnid}, Status: ${status}`);

  if (!verifyResponseHash(req.body)) {
    console.error("[PAYU_WEBHOOK] Hash Mismatch!");
    return next(new AppError("Hash verification failed", 400));
  }

  const payment = await Payment.findOne({ txnid });
  const isSuccess = status && status.toLowerCase() === "success";

  if (payment) {
    if (payment.status === "success") {
      return ApiResponse.success(
        res,
        200,
        null,
        "Already processed as success"
      );
    }

    payment.status = isSuccess ? "success" : "failed";
    payment.payuTxnId = mihpayid;
    payment.fullPayuResponse = req.body;
    await payment.save();

    await Order.findOneAndUpdate(
      { orderId: payment.orderId },
      {
        paymentStatus: isSuccess ? "Completed" : "Failed",
        transactionId: txnid,
      }
    );
  } else {
    // Emergency update if record is missing
    const possibleOrderId = req.body.udf1;
    if (possibleOrderId && possibleOrderId.startsWith("ORD-")) {
      await Order.findOneAndUpdate(
        { orderId: possibleOrderId },
        {
          paymentStatus: isSuccess ? "Completed" : "Failed",
          transactionId: txnid,
        }
      );
    }
  }

  return ApiResponse.success(res, 200, null, "Webhook processed");
});

/**
 * Get All Payments (Admin)
 */
const getAllPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find().sort({ createdAt: -1 });
  return ApiResponse.success(res, 200, payments, "Payments fetched");
});

/**
 * Get My Payments (User)
 */
const getMyPayments = catchAsync(async (req, res, next) => {
  const payments = await Payment.find({ userId: req.user._id }).sort({
    createdAt: -1,
  });
  return ApiResponse.success(res, 200, payments, "My payments fetched");
});

module.exports = {
  initiatePayment,
  handleCallback,
  handleWebhook,
  getAllPayments,
  getMyPayments,
};
