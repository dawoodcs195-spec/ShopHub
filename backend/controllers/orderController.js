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

        let isPaid = false;
        let paidAt = null;
        let paymentStatus = "Pending";
        let transactionId = "";

        // Verify payment with Stripe if that's the chosen method
        if (paymentMethod === "Stripe") {
            const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

            if (paymentIntent.status !== "succeeded") {
                return res.status(400).json({
                    success: false,
                    message: "Stripe payment verification failed. Payment was not successful.",
                });
            }

            isPaid = true;
            paidAt = new Date();
            paymentStatus = "Paid";
            transactionId = paymentIntent.id;
        }

        // Check stock and update product quantities
        for (const item of orderItems) {
            const product = await Product.findById(item.product);

            if (!product) {
                return res.status(404).json({
                    success: false,
                    message: `Product with ID ${item.product} not found.`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Not enough stock for ${product.name}. Only ${product.stock} left.`,
                });
            }
            // Defer saving until all checks pass
        }

        // All checks passed, now update stock
        for (const item of orderItems) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity },
            });
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

        // Update coupon usage count if applicable
        if (coupon) {
            await Coupon.updateOne({ code: coupon }, { $inc: { usedCount: 1 } });
        }

        // Send confirmation emails
        try {
            await sendOrderConfirmationEmail(req.user, order);
            await sendAdminNewOrderEmail(req.user, order);
        } catch (emailError) {
            console.error("Email sending failed after order creation:", emailError.message);
            // Don't fail the request, just log the email error
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
        const order = await Order.findById(req.params.id).populate("user", "name email");

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found.",
            });
        }
        
        // Authorization: Check if user is an admin or the owner of the order
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: "Not authorized to view this order.",
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

        let searchFilter = {};
        if (search.trim()) {
            const keyword = search.trim();
            const isMongoId = /^[0-9a-fA-F]{24}$/.test(keyword);

            if (isMongoId) {
                // If search is a valid MongoID, search by order ID or user ID
                const users = await User.find({_id: keyword}).select('_id');
                searchFilter = {
                    $or: [
                        { _id: keyword },
                        { user: { $in: users.map(u => u._id) } },
                    ],
                };
            } else {
                 // Search user name/email
                 const users = await User.find({
                    $or: [
                        { name: { $regex: keyword, $options: "i" } },
                        { email: { $regex: keyword, $options: "i" } },
                    ]
                }).select('_id');
                
                searchFilter = { user: { $in: users.map(u => u._id) } };
            }
        }
        
        const finalQuery = { ...query, ...searchFilter };

        const totalOrders = await Order.countDocuments(finalQuery);
        
        const orders = await Order.find(finalQuery)
            .populate("user", "name email")
            .sort({ createdAt: -1 })
            .limit(Number(limit))
            .skip((Number(page) - 1) * Number(limit));

        return res.status(200).json({
            success: true,
            count: totalOrders,
            page: Number(page),
            totalPages: Math.ceil(
                totalOrders / Number(limit)
            ),
            limit: Number(limit),
            orders: orders,
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

            const user = await User.findById(order.user);

            if (user) {
                try {
                    await sendDeliveredEmail(user, order);
                } catch (emailError) {
                    console.error("Delivered email failed:", emailError.message);
                }
            }
        } else {
            // If status is changed from Delivered to something else
            order.isDelivered = false;
            order.deliveredAt = null;
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