const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");

const getDashboardStats = async (req, res) => {
    try {
        // ===============================
        // Basic Counts
        // ===============================
        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const totalUsers = await User.countDocuments();

        const lowStockProducts = await Product.countDocuments({
            stock: { $lte: 5 },
        });

        // ===============================
        // Order Statistics
        // ===============================
        const paidOrders = await Order.countDocuments({
            paymentStatus: "Paid",
        });

        const pendingOrders = await Order.countDocuments({
            orderStatus: "Pending",
        });

        const processingOrders = await Order.countDocuments({
            orderStatus: "Processing",
        });

        const shippedOrders = await Order.countDocuments({
            orderStatus: "Shipped",
        });

        const deliveredOrders = await Order.countDocuments({
            orderStatus: "Delivered",
        });

        const cancelledOrders = await Order.countDocuments({
            orderStatus: "Cancelled",
        });

        // ===============================
        // Revenue
        // ===============================
        const revenueOrders = await Order.find({
            $or: [
                {
                    paymentMethod: "Stripe",
                    paymentStatus: "Paid",
                },
                {
                    paymentMethod: "Cash on Delivery",
                    orderStatus: "Delivered",
                },
            ],
        });

        const totalRevenue = revenueOrders.reduce(
            (sum, order) => sum + order.totalPrice,
            0
        );

        // ===============================
        // Recent Orders
        // ===============================
        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        // ===============================
        // Latest Products
        // ===============================
        const latestProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5);

        // ===============================
        // Monthly Revenue
        // ===============================
        const monthlyRevenueAggregation =
            await Order.aggregate([
                {
                    $match: {
                        $or: [
                            {
                                paymentMethod: "Stripe",
                                paymentStatus: "Paid",
                            },
                            {
                                paymentMethod:
                                    "Cash on Delivery",
                                orderStatus:
                                    "Delivered",
                            },
                        ],
                    },
                },
                {
                    $group: {
                        _id: {
                            year: {
                                $year: "$createdAt",
                            },
                            month: {
                                $month: "$createdAt",
                            },
                        },
                        revenue: {
                            $sum: "$totalPrice",
                        },
                    },
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                    },
                },
            ]);

        const monthNames = [
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec",
        ];

        const monthlyRevenue =
            monthlyRevenueAggregation.map((item) => ({
                month:
                    monthNames[item._id.month - 1],
                revenue: item.revenue,
            }));

        // ===============================
        // Monthly Orders
        // ===============================
        const monthlyOrdersAggregation =
            await Order.aggregate([
                {
                    $group: {
                        _id: {
                            year: {
                                $year: "$createdAt",
                            },
                            month: {
                                $month: "$createdAt",
                            },
                        },
                        orders: {
                            $sum: 1,
                        },
                    },
                },
                {
                    $sort: {
                        "_id.year": 1,
                        "_id.month": 1,
                    },
                },
            ]);

        const monthlyOrders =
            monthlyOrdersAggregation.map((item) => ({
                month:
                    monthNames[item._id.month - 1],
                orders: item.orders,
            }));

        // ===============================
        // Payment Method Distribution
        // ===============================
        const paymentMethodsAggregation =
            await Order.aggregate([
                {
                    $group: {
                        _id: "$paymentMethod",
                        value: {
                            $sum: 1,
                        },
                    },
                },
            ]);

        const paymentMethods =
            paymentMethodsAggregation.map((item) => ({
                name: item._id,
                value: item.value,
            }));

        // ===============================
        // Top Selling Products
        // ===============================
        const topProducts = await Order.aggregate([
            {
                $unwind: "$orderItems",
            },
            {
                $group: {
                    _id: "$orderItems.product",
                    name: {
                        $first:
                            "$orderItems.name",
                    },
                    totalSold: {
                        $sum:
                            "$orderItems.quantity",
                    },
                },
            },
            {
                $sort: {
                    totalSold: -1,
                },
            },
            {
                $limit: 5,
            },
        ]);

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
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    getDashboardStats,
};