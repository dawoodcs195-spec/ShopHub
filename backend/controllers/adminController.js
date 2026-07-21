const Product = require("../models/Product");
const Order = require("../models/Order");

const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();

        const totalOrders = await Order.countDocuments();

        const lowStockProducts = await Product.countDocuments({
            stock: { $lte: 5 },
        });

        const orders = await Order.find();

        const totalRevenue = orders.reduce(
            (sum, order) => sum + order.totalPrice,
            0
        );

        const recentOrders = await Order.find()
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(5);

        const latestProducts = await Product.find()
            .sort({ createdAt: -1 })
            .limit(5);

        return res.status(200).json({
            success: true,
            dashboard: {
                totalProducts,
                totalOrders,
                totalRevenue,
                lowStockProducts,
                recentOrders,
                latestProducts,
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