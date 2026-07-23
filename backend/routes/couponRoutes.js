const express = require("express");

const {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
} = require("../controllers/couponController");

const {
    protect,
    authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// Public
// ===============================
router.post(
    "/validate",
    validateCoupon
);

// ===============================
// Admin
// ===============================
router.post(
    "/",
    protect,
    authorize("admin"),
    createCoupon
);

router.get(
    "/",
    protect,
    authorize("admin"),
    getCoupons
);

router.get(
    "/:id",
    protect,
    authorize("admin"),
    getCoupon
);

router.put(
    "/:id",
    protect,
    authorize("admin"),
    updateCoupon
);

router.delete(
    "/:id",
    protect,
    authorize("admin"),
    deleteCoupon
);

module.exports = router;