const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
    try {
        const { period = "all" } = req.query;

        // ===============================
        // Date Filtering Logic
        // ===============================
        const now = new Date();
        let startDate;

        switch (period) {
            case "today":
                startDate = new Date(now.setHours(0, 0, 0, 0));
                break;
            case "7d":
                startDate = new Date(now.setDate(now.getDate() - 7));
                break;
            case "30d":
                startDate = new Date(now.setDate(now.getDate() - 30));
                break;
            case "this_month":
                startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case "this_year":
                startDate = new Date(now.getFullYear(), 0, 1);
                break;
            case "all":
            default:
                startDate = null; // No start date for all time
                break;
        }

        const dateFilter = startDate ? { createdAt: { $gte: startDate } } : {};

        // ===============================
        // Basic Counts (some are not date-dependent)
        // ===============================
        const totalProducts = await Product.countDocuments();
        const totalUsers = await User.countDocuments();
        const lowStockProducts = await Product.countDocuments({ stock: { $lte: 5 } });
        
        const totalOrders = await Order.countDocuments(dateFilter);

        // ===============================
        // Order Statistics (date-dependent)
        // ===============================
        const paidOrders = await Order.countDocuments({ ...dateFilter, paymentStatus: "Paid" });
        const pendingOrders = await Order.countDocuments({ ...dateFilter, orderStatus: "Pending" });
        const processingOrders = await Order.countDocuments({ ...dateFilter, orderStatus: "Processing" });
        const shippedOrders = await Order.countDocuments({ ...dateFilter, orderStatus: "Shipped" });
        const deliveredOrders = await Order.countDocuments({ ...dateFilter, orderStatus: "Delivered" });
        const cancelledOrders = await Order.countDocuments({ ...dateFilter, orderStatus: "Cancelled" });

        // ===============================
        // Revenue (date-dependent)
        // ===============================
        const revenueFilter = {
            ...dateFilter,
            $or: [
                { paymentMethod: "Stripe", paymentStatus: "Paid" },
                { paymentMethod: "Cash on Delivery", orderStatus: "Delivered" },
            ],
        };
        const revenueOrders = await Order.find(revenueFilter);
        const totalRevenue = revenueOrders.reduce((sum, order) => sum + order.totalPrice, 0);

        // ===============================
        // Recent Orders (date-dependent)
        // ===============================
        const recentOrders = await Order.find(dateFilter)
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        // ===============================
        // Latest Products (not date-dependent)
        // ===============================
        const latestProducts = await Product.find().sort({ createdAt: -1 }).limit(5);

        // ===============================
        // Aggregations (all need to be date-dependent)
        // ===============================
        const initialMatchStage = startDate ? [{ $match: dateFilter }] : [];

        // Monthly Revenue
        const monthlyRevenueAggregation = await Order.aggregate([
            ...initialMatchStage,
            {
                $match: {
                    $or: [
                        { paymentMethod: "Stripe", paymentStatus: "Paid" },
                        { paymentMethod: "Cash on Delivery", orderStatus: "Delivered" },
                    ],
                },
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    revenue: { $sum: "$totalPrice" },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);
        
        // Monthly Orders
        const monthlyOrdersAggregation = await Order.aggregate([
            ...initialMatchStage,
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    orders: { $sum: 1 },
                },
            },
            { $sort: { "_id.year": 1, "_id.month": 1 } },
        ]);

        // Payment Method Distribution
        const paymentMethodsAggregation = await Order.aggregate([
            ...initialMatchStage,
            {
                $group: {
                    _id: "$paymentMethod",
                    value: { $sum: 1 },
                },
            },
        ]);
        
        // Top Selling Products
        const topProducts = await Order.aggregate([
            ...initialMatchStage,
            { $unwind: "$orderItems" },
            {
                $group: {
                    _id: "$orderItems.product",
                    name: { $first: "$orderItems.name" },
                    totalSold: { $sum: "$orderItems.quantity" },
                },
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
        ]);

        // Helper to format aggregation results
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyRevenue = monthlyRevenueAggregation.map((item) => ({ month: monthNames[item._id.month - 1], revenue: item.revenue }));
        const monthlyOrders = monthlyOrdersAggregation.map((item) => ({ month: monthNames[item._id.month - 1], orders: item.orders }));
        const paymentMethods = paymentMethodsAggregation.map((item) => ({ name: item._id, value: item.value }));

        return res.status(200).json({
            success: true,
            dashboard: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue,
                lowStockProducts,
                paidOrders,
                pendingOrders,
                processingOrders,
                shippedOrders,
                deliveredOrders,
                cancelledOrders,
                recentOrders,
                latestProducts,
                monthlyRevenue,
                monthlyOrders,
                paymentMethods,
                topProducts,
            },
        });
    } catch (error) {
        console.error("Dashboard Stats Error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error while fetching dashboard stats.",
        });
    }
};

module.exports = {
    getDashboardStats,
};