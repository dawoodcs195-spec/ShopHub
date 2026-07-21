const express = require("express");

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

const router = express.Router();

// User
router.post("/", protect, createOrder);

router.get("/my-orders", protect, getMyOrders);

router.get("/:id", protect, getSingleOrder);

// Admin
router.get(
    "/",
    protect,
    authorize("admin"),
    getAllOrders
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateOrderStatus
);

module.exports = router;