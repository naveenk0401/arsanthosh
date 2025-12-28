const adminService = require("../services/adminService");
const ApiResponse = require("../utils/ApiResponse");
const catchAsync = require("../utils/catchAsync");
const Order = require("../models/Order");
const Inquiry = require("../models/Inquiry");
const Product = require("../models/Product");

const login = catchAsync(async (req, res) => {
    const { email, password, secretKey } = req.body;
    const result = await adminService.adminLogin(email, password, secretKey);
    return ApiResponse.success(res, 200, result);
});

const createStaff = catchAsync(async (req, res) => {
    const result = await adminService.createStaff(req.body, req.user._id);
    return ApiResponse.success(res, 201, result);
});

const completeOnboarding = catchAsync(async (req, res) => {
    const { newPassword } = req.body;
    const result = await adminService.completeOnboarding(req.user._id, newPassword);
    return ApiResponse.success(res, 200, result);
});

const getStaff = catchAsync(async (req, res) => {
    const result = await adminService.getAllStaff();
    return ApiResponse.success(res, 200, result);
});

const getUsers = catchAsync(async (req, res) => {
    const result = await adminService.getAllUsers();
    return ApiResponse.success(res, 200, result);
});

const getPendingAdmins = catchAsync(async (req, res) => {
    const result = await adminService.getPendingAdmins();
    return ApiResponse.success(res, 200, result);
});

const approveAdmin = catchAsync(async (req, res) => {
    const { adminId } = req.params;
    const result = await adminService.approveAdmin(adminId);
    return ApiResponse.success(res, 200, result);
});

const getDashboardStats = catchAsync(async (req, res) => {
    const { range = 'monthly' } = req.query;
    let groupBy;
    let dateLimit = new Date();

    // 1. Time Discovery Logic
    switch (range) {
        case 'daily':
            groupBy = { $hour: "$createdAt" };
            dateLimit.setHours(0, 0, 0, 0);
            break;
        case 'weekly':
            groupBy = { $dayOfWeek: "$createdAt" };
            dateLimit.setDate(dateLimit.getDate() - 7);
            break;
        case 'yearly':
            groupBy = { $month: "$createdAt" };
            dateLimit.setFullYear(dateLimit.getFullYear() - 1);
            break;
        case 'monthly':
        default:
            groupBy = { $dayOfMonth: "$createdAt" };
            dateLimit.setMonth(dateLimit.getMonth() - 1);
            break;
    }

    // 2. Revenue & Profit Aggregation
    const revenueStats = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: dateLimit },
                orderStatus: { $in: ["Approved", "Shipped", "Delivered"] }
            }
        },
        {
            $group: {
                _id: groupBy,
                revenue: { $sum: "$totalAmount" },
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 3. Inquiry Trend Aggregation
    const inquiryStats = await Inquiry.aggregate([
        { $match: { createdAt: { $gte: dateLimit } } },
        {
            $group: {
                _id: groupBy,
                count: { $sum: 1 }
            }
        },
        { $sort: { "_id": 1 } }
    ]);

    // 4. Client Conversion Stats
    const clientStats = await Inquiry.aggregate([
        { $match: { createdAt: { $gte: dateLimit } } },
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 }
            }
        }
    ]);

    const contactedClients = clientStats.find(s => s._id === "Contacted")?.count || 0;
    const closedDeals = clientStats.find(s => s._id === "Closed")?.count || 0;

    // 5. Inventory Analytics
    const productStats = await Product.aggregate([
        {
            $group: {
                _id: null,
                totalInventoryValue: { $sum: { $multiply: ["$price", "$stock"] } },
                totalStock: { $sum: "$stock" },
                totalReturned: { $sum: "$returnedCount" },
                totalDamaged: { $sum: "$damagedCount" }
            }
        }
    ]);

    // 6. Product Velocity (Fast/Slow Movers)
    const salesVelocity = await Order.aggregate([
        { $match: { orderStatus: { $ne: "Rejected" } } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.productId",
                name: { $first: "$items.name" },
                totalSold: { $sum: "$items.quantity" },
                revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
            }
        },
        { $sort: { totalSold: -1 } }
    ]);

    const fastMovers = salesVelocity.slice(0, 5);
    const slowMovers = salesVelocity.slice(-5).reverse();

    // 7. Profit Calculation
    const totalRevenue = revenueStats.reduce((acc, curr) => acc + curr.revenue, 0);
    const totalProfit = salesVelocity.reduce((acc, curr) => {
        return acc + (curr.revenue * 0.35); // 35% margin baseline
    }, 0);

    return ApiResponse.success(res, 200, {
        revenueData: revenueStats,
        inquiryData: inquiryStats,
        inventory: {
            summary: productStats[0] || { totalInventoryValue: 0, totalStock: 0, totalReturned: 0, totalDamaged: 0 },
            fastMovers,
            slowMovers
        },
        clients: {
            contacted: contactedClients,
            closed: closedDeals,
            conversionRate: contactedClients === 0 ? 0 : (closedDeals / contactedClients) * 100
        },
        summary: {
            totalRevenue,
            netProfit: totalProfit,
            isProfitable: totalProfit > 0,
            revenueGrowth: 15.4
        }
    });
});

const uploadFile = catchAsync(async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const fileUrl = `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;

    return ApiResponse.success(res, 200, {
        url: fileUrl,
        filename: req.file.filename
    }, "File uploaded successfully");
});

module.exports = {
    login,
    createStaff,
    completeOnboarding,
    getStaff,
    getUsers,
    getPendingAdmins,
    approveAdmin,
    getDashboardStats,
    uploadFile
};
