const Order = require("../models/Order");
const Product = require("../models/Product");
const Coupon = require("../models/Coupon");
const User = require("../models/User");
const Stripe = require("stripe");

const {
    sendOrderConfirmationEmail,
    sendAdminNewOrderEmail,
    sendDeliveredEmail,
} = require("../services/emailService");

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
            coupon,
            discount,
        } = req.body;

        if (!orderItems || orderItems.length === 0) {
            return res.status(400).json({
                success: false,
                message: "No order items.",
            });
        }

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

        for (const item of orderItems) {
            const product = await Product.findById(
                item.product
            );

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

        for (const item of orderItems) {
            const product = await Product.findById(
                item.product
            );

            product.stock -= item.quantity;

            await product.save();
        }

        const order = await Order.create({
            user: req.user._id,
            orderItems,
            shippingAddress,
            paymentMethod,
            paymentStatus,
            transactionId,
            isPaid,
            paidAt,
            coupon: coupon || "",
            discount: discount || 0,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
        });

        if (coupon) {
            const couponDoc =
                await Coupon.findOne({
                    code: coupon,
                });

            if (couponDoc) {
                couponDoc.usedCount += 1;

                await couponDoc.save();
            }
        }

        try {
            await sendOrderConfirmationEmail(
                req.user,
                order
            );
        } catch (emailError) {
            console.error(
                "Order confirmation email failed:",
                emailError.message
            );
        }

        try {
            await sendAdminNewOrderEmail(
                req.user,
                order
            );
        } catch (emailError) {
            console.error(
                "Admin notification email failed:",
                emailError.message
            );
        }

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
        const order = await Order.findById(
            req.params.id
        ).populate("user", "name email");

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
        const {
            search = "",
            orderStatus,
            paymentStatus,
            paymentMethod,
            startDate,
            endDate,
            page = 1,
            limit = 10,
        } = req.query;

        const query = {};

        if (orderStatus) {
            query.orderStatus = orderStatus;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        if (paymentMethod) {
            query.paymentMethod = paymentMethod;
        }

        if (startDate || endDate) {
            query.createdAt = {};

            if (startDate) {
                query.createdAt.$gte = new Date(
                    startDate
                );
            }

            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                query.createdAt.$lte = end;
            }
        }

        let orders = await Order.find(query)
            .populate("user", "name email")
            .sort({
                createdAt: -1,
            });

        if (search.trim()) {
            const keyword = search
                .trim()
                .toLowerCase();

            orders = orders.filter((order) => {
                const name =
                    order.user?.name?.toLowerCase() ||
                    "";

                const email =
                    order.user?.email?.toLowerCase() ||
                    "";

                return (
                    name.includes(keyword) ||
                    email.includes(keyword) ||
                    order._id
                        .toString()
                        .toLowerCase()
                        .includes(keyword)
                );
            });
        }

        const totalRevenue = orders.reduce(
            (total, order) =>
                total + order.totalPrice,
            0
        );

        const totalOrders = orders.length;

        const currentPage = Number(page);
        const pageSize = Number(limit);

        const paginatedOrders = orders.slice(
            (currentPage - 1) * pageSize,
            currentPage * pageSize
        );

        return res.status(200).json({
            success: true,
            totalRevenue,
            count: totalOrders,
            page: currentPage,
            totalPages: Math.ceil(
                totalOrders / pageSize
            ),
            limit: pageSize,
            orders: paginatedOrders,
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
const updateOrderStatus = async (
    req,
    res
) => {
    try {
        const order = await Order.findById(
            req.params.id
        );

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }

        order.orderStatus =
            req.body.orderStatus;

        if (
            req.body.orderStatus ===
            "Delivered"
        ) {
            order.isDelivered = true;
            order.deliveredAt = Date.now();

            const user =
                await User.findById(
                    order.user
                );

            if (user) {
                try {
                    await sendDeliveredEmail(
                        user,
                        order
                    );
                } catch (emailError) {
                    console.error(
                        "Delivered email failed:",
                        emailError.message
                    );
                }
            }
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