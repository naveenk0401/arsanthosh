const Order = require("../models/Order");
const Inquiry = require("../models/Inquiry");
const mongoose = require("mongoose");

const getStats = async (req, res) => {
    try {
        const { range = 'monthly' } = req.query;
        let groupBy;
        let dateLimit = new Date();

        switch (range) {
            case 'daily':
                groupBy = { $dayOfMonth: "$createdAt" };
                dateLimit.setHours(0, 0, 0, 0); // Today
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

        // Revenue Stats (From Orders now)
        const revenueStats = await Order.aggregate([
            {
                $match: {
                    createdAt: { $gte: dateLimit },
                    orderStatus: { $in: ["Approved", "Shipped", "Delivered"] } // Count revenue when approved/shipped/delivered
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

        // Inquiry Stats
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

        // Calculate Profit/Loss (Basic simulation as requested)
        // In a real app, expenses would be in another collection
        const totalRevenue = revenueStats.reduce((acc, curr) => acc + curr.revenue, 0);
        const estimatedExpenses = totalRevenue * 0.45; // Simulated 45% cost/expenditure
        const netProfit = totalRevenue - estimatedExpenses;

        // Comparison (Current vs Previous)
        // Hardcoded for now to show the logic, will refine if real historic data needed
        const prevMonthRevenue = totalRevenue * 0.85; // Simulated previous month was lower

        res.json({
            success: true,
            data: {
                revenueData: revenueStats,
                inquiryData: inquiryStats,
                summary: {
                    totalRevenue,
                    estimatedExpenses,
                    netProfit,
                    isProfitable: netProfit > 0,
                    revenueGrowth: prevMonthRevenue === 0 ? 0 : ((totalRevenue - prevMonthRevenue) / prevMonthRevenue) * 100
                }
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};

module.exports = { getStats };
