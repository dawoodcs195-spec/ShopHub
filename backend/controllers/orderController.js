const Order = require("../models/Order");
const Product = require("../models/Product");
const Stripe = require("stripe");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ======================================
// Create Order
// ======================================
const createOrder = async (req, res) => {
    try {
        const {
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentIntentId,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No order items.",
            });
        }

        // ======================================
        // Stripe Payment Verification
        // ======================================
        let isPaid = false;
        let paidAt = null;
        let paymentStatus = "Pending";
        let transactionId = "";

        if (paymentMethod === "Stripe") {
            if (!paymentIntentId) {
                return res.status(400).json({
                    success: false,
                    message: "Payment Intent ID is required.",
                });
            }

            const paymentIntent =
                await stripe.paymentIntents.retrieve(
                    paymentIntentId
                );

            if (paymentIntent.status !== "succeeded") {
                return res.status(400).json({
                    success: false,
                    message: "Stripe payment verification failed.",
                });
            }

            isPaid = true;
            paidAt = new Date();
            paymentStatus = "Paid";
            transactionId = paymentIntent.id;
        }

        // ======================================
        // Validate Stock
        // ======================================
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `${item.name} not found.`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Only ${product.stock} ${product.name} left in stock.`,
                });
            }
        }

        // ======================================
        // Reduce Stock
        // ======================================
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            product.stock -= item.quantity;

            await product.save();
        }

        // ======================================
        // Create Order
        // ======================================
        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus,
            transactionId,
            isPaid,
            paidAt,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });

        return res.status(201).json({
            success: true,
            message: "Order placed successfully.",
            order,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================
// Get Logged-in User Orders
// ======================================
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            user: req.user._id,
        }).sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: orders.length,
            orders,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================
// Get Single Order
// ======================================
const getSingleOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("user", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        return res.status(200).json({
            success: true,
            order,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================
// Get All Orders (Admin)
// ======================================
const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .sort({
                createdAt: -1,
            });

        const totalRevenue = orders.reduce(
            (total, order) => total + order.totalPrice,
            0
        );

        return res.status(200).json({
            success: true,
            totalRevenue,
            count: orders.length,
            orders,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ======================================
// Update Order Status (Admin)
// ======================================
const updateOrderStatus = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        order.orderStatus = req.body.orderStatus;

        if (req.body.orderStatus === "Delivered") {
            order.isDelivered = true;
            order.deliveredAt = Date.now();
        }

        await order.save();

        return res.status(200).json({
            success: true,
            message: "Order updated successfully.",
            order,
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getSingleOrder,
    getAllOrders,
    updateOrderStatus,
};