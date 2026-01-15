const Order = require("../models/Order");
const AppError = require("../utils/AppError");
const activityService = require("./activityService");
const emailService = require("./emailService");

const createOrder = async (orderData, user) => {
  console.log(
    "[ORDER_SERVICE] Received orderData:",
    JSON.stringify(orderData, null, 2)
  );
  const {
    customerName,
    email,
    phone,
    address,
    items,
    totalAmount,
    paymentMethod,
  } = orderData;
  const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  try {
    const newOrder = await Order.create({
      orderId,
      userId: user ? user._id : null,
      customerName,
      email,
      phone,
      address,
      items,
      totalAmount,
      paymentMethod,
      paymentStatus: "Pending",
      orderStatus: "Pending",
    });

    console.log(
      "[ORDER_SERVICE] Order created successfully:",
      newOrder.orderId
    );

    await activityService.logActivity(
      "PAYMENT",
      `New Order #${newOrder.orderId} placed by ${customerName} (₹${totalAmount})`,
      {
        targetTab: "payments",
        targetId: newOrder._id,
      }
    );

    return newOrder;
  } catch (error) {
    console.error("[ORDER_SERVICE] Error creating order:", error);
    throw new AppError(`Failed to create order: ${error.message}`, 500);
  }
};

const getAllOrders = async () => {
  return await Order.find().sort({ createdAt: -1 });
};

const getMyOrders = async (userId) => {
  return await Order.find({ userId }).sort({ createdAt: -1 });
};

const getOrderById = async (id) => {
  const order = await Order.findById(id);
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

const getOrderByTransactionId = async (txnid) => {
  const order = await Order.findOne({ transactionId: txnid });
  if (!order) throw new AppError("Order not found", 404);
  return order;
};

const updateOrderStatus = async (orderId, status, adminId) => {
  const order = await Order.findById(orderId);
  if (!order) throw new AppError("Order not found", 404);

  const oldStatus = order.orderStatus;
  order.orderStatus = status;

  await order.save();

  if (status === "Approved" && oldStatus !== "Approved") {
    // Send email asynchronously (non-blocking)
    emailService
      .sendOrderConfirmation(order.email, order)
      .catch((err) =>
        console.error(
          "Failed to send order approval email (Background):",
          err.message
        )
      );
  }

  await activityService.logActivity(
    "SYSTEM",
    `Order #${order.orderId} status updated to: ${status}`,
    {
      adminId,
      targetTab: "payments",
      targetId: order._id,
    }
  );

  return order;
};

const PDFDocument = require("pdfkit");

const generateInvoicePDF = (order, stream) => {
  const doc = new PDFDocument({ size: "A4", margin: 30 });
  doc.pipe(stream);

  const websiteUrl =
    "https://arsanthosh-git-develop-naveenk0401s-projects.vercel.app/";
  const companyName = "AR SANTHOSH STUDIO";
  const companyAddress =
    "#123, Architectural Avenue, Layout 2, Bangalore, KA - 560001";
  const companyGSTIN = "29ABCDE1234F1Z5";
  const companyPAN = "ABCDE1234F";

  // --- TOP HEADER ---
  // Placeholder for Logo
  doc.fontSize(16).fillColor("#111").text(companyName, 30, 30, { bold: true });
  doc
    .fontSize(8)
    .fillColor("#555")
    .text("Architectural Consultancy & Premium Products", 30, 50);

  doc
    .fontSize(18)
    .fillColor("#000")
    .text("TAX INVOICE", 0, 30, { align: "right" });
  doc.moveDown(2);

  const topSectionY = 80;

  // Left: Invoice Info
  doc.fontSize(8).fillColor("#000");
  doc.text(`Order ID: ${order.orderId}`, 30, topSectionY, { bold: true });
  doc.text(
    `Invoice Number: INV-${order.orderId.split("-")[1] || Date.now()}`,
    30,
    topSectionY + 12
  );
  doc.text(
    `Invoice Date: ${new Date().toLocaleDateString()}`,
    30,
    topSectionY + 24
  );
  doc.text(
    `Order Date: ${new Date(order.createdAt).toLocaleDateString()}`,
    30,
    topSectionY + 36
  );
  doc.text(`Payment Mode: ${order.paymentMethod}`, 30, topSectionY + 48);

  // Right: Seller Details
  const sellerX = 350;
  doc.text("Sold By:", sellerX, topSectionY, { bold: true });
  doc.text(companyName, sellerX, topSectionY + 12);
  doc.text(companyAddress, sellerX, topSectionY + 24, { width: 210 });
  doc.text(`GSTIN: ${companyGSTIN}`, sellerX, doc.y + 2);
  doc.text(`PAN: ${companyPAN}`, sellerX, doc.y + 2);
  doc.text(`Website: ${websiteUrl}`, sellerX, doc.y + 2);

  doc.moveDown(2);
  const midSectionY = doc.y + 10;

  // --- CUSTOMER DETAILS ---
  doc.rect(30, midSectionY, 260, 100).stroke(); // Billing Box
  doc.rect(305, midSectionY, 260, 100).stroke(); // Shipping Box

  doc.text("Billing Address:", 40, midSectionY + 10, { bold: true });
  doc.text(order.customerName, 40, midSectionY + 22);
  doc.text(`${order.address}, ${order.street || ""}`, 40, midSectionY + 32, {
    width: 240,
  });
  doc.text(`${order.city}, ${order.state} - ${order.pincode}`, 40, doc.y + 2);
  doc.text(
    `State Code: ${order.state?.substring(0, 2).toUpperCase() || "KA"}`,
    40,
    doc.y + 2
  );
  doc.text(`Phone: ${order.phone}`, 40, doc.y + 2);

  doc.text("Shipping Address:", 315, midSectionY + 10, { bold: true });
  doc.text(order.customerName, 315, midSectionY + 22);
  doc.text(`${order.address}, ${order.street || ""}`, 315, midSectionY + 32, {
    width: 240,
  });
  doc.text(`${order.city}, ${order.state} - ${order.pincode}`, 315, doc.y + 2);
  doc.text(`Place of Supply: ${order.state || "N/A"}`, 315, doc.y + 2);

  doc.moveDown(4);

  // --- ORDER TABLE ---
  const tableTop = doc.y + 20;
  const col = {
    desc: 30,
    hsn: 180,
    qty: 230,
    gross: 260,
    disc: 310,
    taxVal: 360,
    cgst: 410,
    sgst: 470,
    total: 530,
  };

  // Header Row
  doc.rect(30, tableTop, 535, 25).fill("#f5f5f5").stroke();
  doc.fillColor("#000").fontSize(7);
  doc.text("Product Description", col.desc + 5, tableTop + 8, { bold: true });
  doc.text("HSN", col.hsn, tableTop + 8, { bold: true });
  doc.text("Qty", col.qty, tableTop + 8, { bold: true });
  doc.text("Gross Amt", col.gross, tableTop + 8, { bold: true });
  doc.text("Disc", col.disc, tableTop + 8, { bold: true });
  doc.text("Taxable", col.taxVal, tableTop + 8, { bold: true });
  doc.text("CGST", col.cgst, tableTop + 8, { bold: true });
  doc.text("SGST", col.sgst, tableTop + 8, { bold: true });
  doc.text("Total", col.total, tableTop + 8, { bold: true });

  let currentY = tableTop + 25;
  let totalTaxable = 0;
  let totalCGST = 0;
  let totalSGST = 0;

  order.items.forEach((item) => {
    const gross = item.price * item.quantity;
    const disc = 0; // Simplified
    const taxable = gross - disc;
    const cgstRate = 0.09; // 9%
    const sgstRate = 0.09; // 9%
    const cgstAmt = taxable * cgstRate;
    const sgstAmt = taxable * sgstRate;
    const itemTotal = taxable + cgstAmt + sgstAmt;

    totalTaxable += taxable;
    totalCGST += cgstAmt;
    totalSGST += sgstAmt;

    doc.rect(30, currentY, 535, 25).stroke();
    doc.text(item.name, col.desc + 5, currentY + 8, { width: 140 });
    doc.text("9406", col.hsn, currentY + 8); // Generic HSN
    doc.text(item.quantity.toString(), col.qty, currentY + 8);
    doc.text(gross.toLocaleString(), col.gross, currentY + 8);
    doc.text(disc.toLocaleString(), col.disc, currentY + 8);
    doc.text(taxable.toLocaleString(), col.taxVal, currentY + 8);
    doc.text(`9% - ${cgstAmt.toFixed(2)}`, col.cgst, currentY + 8);
    doc.text(`9% - ${sgstAmt.toFixed(2)}`, col.sgst, currentY + 8);
    doc.text(itemTotal.toFixed(2), col.total, currentY + 8);

    currentY += 25;
  });

  // --- SUMMARY SECTION ---
  doc.moveDown(2);
  const summaryY = currentY + 10;
  doc.fontSize(9).text("Sub Total:", 400, summaryY);
  doc.text(`${totalTaxable.toLocaleString()}`, 500, summaryY, {
    align: "right",
  });

  doc.text("Total Discount:", 400, summaryY + 12);
  doc.text("0.00", 500, summaryY + 12, { align: "right" });

  doc.text("CGST Total:", 400, summaryY + 24);
  doc.text(`${totalCGST.toFixed(2)}`, 500, summaryY + 24, { align: "right" });

  doc.text("SGST Total:", 400, summaryY + 36);
  doc.text(`${totalSGST.toFixed(2)}`, 500, summaryY + 36, { align: "right" });

  doc
    .rect(380, summaryY + 50, 185, 30)
    .fill("#eee")
    .stroke();
  doc
    .fillColor("#000")
    .fontSize(12)
    .text("Grand Total:", 390, summaryY + 60, { bold: true });
  doc.text(`INR ${order.totalAmount.toLocaleString()}`, 500, summaryY + 60, {
    bold: true,
    align: "right",
  });

  // --- DECLARATION & SIGNATURE ---
  const footerStart = 650;
  doc.fontSize(8).fillColor("#333");
  doc.text("Declaration:", 30, footerStart, { bold: true });
  doc.text(
    "The goods sold are intended for end-user consumption and not for resale.",
    30,
    footerStart + 10
  );

  doc.text("Authorized Signatory", 450, footerStart, { bold: true });
  doc.moveDown();
  doc.fontSize(10).text(companyName, 450, footerStart + 40, { bold: true });
  doc.fontSize(8).text("(Digitally Signed)", 450, footerStart + 52);

  // --- FOOTER ---
  doc.moveTo(30, 750).lineTo(565, 750).stroke();
  doc.fontSize(7).fillColor("#999");
  doc.text(
    "E. & O.E. | This is a system-generated invoice valid without physical signature.",
    30,
    760,
    { align: "center", width: 535 }
  );
  doc.text(
    `${companyName} | ${websiteUrl} | Support: support@arsanthosh.com`,
    30,
    770,
    { align: "center", width: 535 }
  );

  doc.end();
};

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  getOrderByTransactionId,
  updateOrderStatus,
  generateInvoicePDF,
};
