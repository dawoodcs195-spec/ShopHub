const express = require("express");
const { body, param } = require("express-validator");

const {
    createOrder,
    getMyOrders,
    getSingleOrder,
    getAllOrders,
    updateOrderStatus,
} = require("../controllers/orderController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

// Validation Rules
const createOrderValidation = [
    body("shippingAddress.address", "Shipping address is required").notEmpty(),
    body("shippingAddress.city", "City is required").notEmpty(),
    body("shippingAddress.postalCode", "Postal code is required").notEmpty(),
    body("shippingAddress.country", "Country is required").notEmpty(),
    body("paymentMethod", "Payment method is required").isIn(["Stripe", "Cash on Delivery"]),
    body("paymentIntentId", "Stripe Payment Intent ID is required for Stripe payments")
        .if(body("paymentMethod").equals("Stripe"))
        .notEmpty(),
    body("orderItems", "Order must contain at least one item").isArray({ min: 1 }),
    body("orderItems.*.quantity", "Item quantity must be a positive number").isInt({ gt: 0 }),
    body("orderItems.*.product", "Invalid product ID").isMongoId(),
    body("itemsPrice", "Items price must be a valid number").isFloat({ min: 0 }),
    body("shippingPrice", "Shipping price must be a valid number").isFloat({ min: 0 }),
    body("taxPrice", "Tax price must be a valid number").isFloat({ min: 0 }),
    body("totalPrice", "Total price must be a positive number").isFloat({ gt: 0 }),
];

const updateOrderStatusValidation = [
    param("id", "Invalid Order ID").isMongoId(),
    body("orderStatus", "Invalid order status").isIn([
        "Pending",
        "Processing",
        "Shipped",
        "Delivered",
        "Cancelled",
    ]),
];

// User
router.post("/", protect, createOrderValidation, validationMiddleware, createOrder);
router.get("/my-orders", protect, getMyOrders);
router.get("/:id", [param("id", "Invalid Order ID").isMongoId()], validationMiddleware, getSingleOrder);

// Admin
router.get("/", protect, authorize("admin"), getAllOrders);
router.put("/:id", protect, authorize("admin"), updateOrderStatusValidation, validationMiddleware, updateOrderStatus);

module.exports = router;