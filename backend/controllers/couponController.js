const Coupon = require("../models/Coupon");

// ===============================
// Create Coupon
// ===============================
const createCoupon = async (req, res) => {
    try {
        const {
            code,
            type,
            value,
            minimumAmount,
            expiryDate,
            usageLimit,
            description,
        } = req.body;

        const existingCoupon = await Coupon.findOne({
            code: code.toUpperCase().trim(),
        });

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "Coupon already exists.",
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase().trim(),
            type,
            value,
            minimumAmount,
            expiryDate,
            usageLimit,
            description,
        });

        return res.status(201).json({
            success: true,
            message: "Coupon created successfully.",
            coupon,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Get All Coupons
// ===============================
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find().sort({
            createdAt: -1,
        });

        return res.status(200).json({
            success: true,
            count: coupons.length,
            coupons,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Get Single Coupon
// ===============================
const getCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }

        return res.status(200).json({
            success: true,
            coupon,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Update Coupon
// ===============================
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }

        Object.assign(coupon, req.body);

        if (req.body.code) {
            coupon.code = req.body.code
                .toUpperCase()
                .trim();
        }

        await coupon.save();

        return res.status(200).json({
            success: true,
            message: "Coupon updated successfully.",
            coupon,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Delete Coupon
// ===============================
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Coupon not found.",
            });
        }

        await coupon.deleteOne();

        return res.status(200).json({
            success: true,
            message: "Coupon deleted successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Validate Coupon
// ===============================
const validateCoupon = async (req, res) => {
    try {
        const { code, total } = req.body;

        const coupon = await Coupon.findOne({
            code: code.toUpperCase().trim(),
        });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: "Invalid coupon.",
            });
        }

        if (!coupon.isActive) {
            return res.status(400).json({
                success: false,
                message: "Coupon is inactive.",
            });
        }

        if (coupon.expiryDate < new Date()) {
            return res.status(400).json({
                success: false,
                message: "Coupon has expired.",
            });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({
                success: false,
                message: "Coupon usage limit reached.",
            });
        }

        if (total < coupon.minimumAmount) {
            return res.status(400).json({
                success: false,
                message: `Minimum purchase amount is Rs. ${coupon.minimumAmount}.`,
            });
        }

        let discount = 0;

        if (coupon.type === "percentage") {
            discount = (total * coupon.value) / 100;
        } else {
            discount = coupon.value;
        }

        discount = Math.min(discount, total);

        return res.status(200).json({
            success: true,
            coupon,
            discount,
            finalTotal: total - discount,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createCoupon,
    getCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
    validateCoupon,
};