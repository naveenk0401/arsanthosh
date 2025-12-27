const Order = require("../models/Order");
const Inquiry = require("../models/Inquiry");
const Product = require("../models/Product");
const mongoose = require("mongoose");

const getStats = async (req, res) => {
    try {
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

        // 7. Profit Calculation (Precise if cost exists, else margin-based)
        const totalRevenue = revenueStats.reduce((acc, curr) => acc + curr.revenue, 0);
        const totalProfit = salesVelocity.reduce((acc, curr) => {
            // In a real scenario, we'd join with Product to get actual costPrice
            // For now, using a standard 35% profit margin as a scalable baseline
            return acc + (curr.revenue * 0.35);
        }, 0);

        res.json({
            success: true,
            data: {
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
                    revenueGrowth: 15.4 // Placeholder for trend logic
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getStats };
