const express = require("express");
const { body, param } = require("express-validator");

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

const validationMiddleware = require("../middleware/validationMiddleware");

const router = express.Router();

// Validation Rules
const couponValidationRules = [
    body("code")
        .trim()
        .toUpperCase()
        .isLength({ min: 3, max: 20 })
        .withMessage("Coupon code must be between 3 and 20 characters"),
    body("type")
        .isIn(['percentage', 'fixed'])
        .withMessage("Coupon type must be either 'percentage' or 'fixed'"),
    body("value")
        .isFloat({ gt: 0 })
        .withMessage("Discount value must be a positive number"),
    body("value")
        .if(body("type").equals("percentage"))
        .isFloat({ max: 100 })
        .withMessage("Percentage discount cannot exceed 100"),
    body("expiryDate")
        .isISO8601()
        .toDate()
        .withMessage("Invalid expiry date format")
        .custom(value => {
            if (value.getTime() < Date.now()) {
                throw new Error('Expiry date must be in the future');
            }
            return true;
        }),
    body("usageLimit")
        .isInt({ min: 1 })
        .withMessage("Usage limit must be at least 1"),
    body("minimumAmount")
        .optional()
        .isFloat({ min: 0 })
        .withMessage("Minimum amount must be a non-negative number"),
    body("description").optional().trim(),
];

const updateCouponValidationRules = [
    param("id", "Invalid Coupon ID").isMongoId(),
    // Optional rules for update
    body("code").optional().trim().toUpperCase().isLength({ min: 3, max: 20 }),
    body("type").optional().isIn(['percentage', 'fixed']),
    body("value").optional().isFloat({ gt: 0 }),
    body("expiryDate").optional().isISO8601().toDate(),
    body("usageLimit").optional().isInt({ min: 1 }),
];

const idParamValidation = [
    param("id", "Invalid Coupon ID").isMongoId(),
];

const validateCouponBody = [
    body("code", "Coupon code is required").trim().toUpperCase().notEmpty(),
    body("total", "Total amount is required").isFloat({ min: 0 }),
];

// ===============================
// Public
// ===============================
router.post("/validate", validateCouponBody, validationMiddleware, validateCoupon);

// ===============================
// Admin
// ===============================
router.post("/", protect, authorize("admin"), couponValidationRules, validationMiddleware, createCoupon);
router.get("/", protect, authorize("admin"), getCoupons);
router.get("/:id", protect, authorize("admin"), idParamValidation, validationMiddleware, getCoupon);
router.put("/:id", protect, authorize("admin"), updateCouponValidationRules, validationMiddleware, updateCoupon);
router.delete("/:id", protect, authorize("admin"), idParamValidation, validationMiddleware, deleteCoupon);

module.exports = router;