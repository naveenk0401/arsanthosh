const orderService = require("../services/orderService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");

const createOrder = catchAsync(async (req, res) => {
  const order = await orderService.createOrder(req.body, req.user);
  return ApiResponse.success(res, 201, order, "Order created successfully");
});

const getAllOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getAllOrders();
  return ApiResponse.success(res, 200, orders, "Orders fetched successfully");
});

const getMyOrders = catchAsync(async (req, res) => {
  const orders = await orderService.getMyOrders(req.user._id);
  return ApiResponse.success(res, 200, orders, "My orders fetched");
});

const getOrderById = catchAsync(async (req, res) => {
  const order = await orderService.getOrderById(req.params.id);
  return ApiResponse.success(res, 200, order);
});

const getOrderByTransactionId = catchAsync(async (req, res) => {
  const { txnid } = req.params;
  const order = await orderService.getOrderByTransactionId(txnid);
  return ApiResponse.success(res, 200, order);
});

const downloadInvoice = catchAsync(async (req, res) => {
  const { id } = req.params;
  const order = await orderService.getOrderById(id);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    `attachment; filename=invoice-${order.orderId}.pdf`
  );

  orderService.generateInvoicePDF(order, res);
});

const updateOrderStatus = catchAsync(async (req, res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  const order = await orderService.updateOrderStatus(
    orderId,
    status,
    req.user?.id
  );
  return ApiResponse.success(res, 200, order, "Order status updated");
});

module.exports = {
  createOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  getOrderByTransactionId,
  downloadInvoice,
  updateOrderStatus,
};
