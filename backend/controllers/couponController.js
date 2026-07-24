const Coupon = require("../models/Coupon");

// ===============================
// Create Coupon
// ===============================
const createCoupon = async (req, res) => {
    try {
        const { code, type, value, minimumAmount, expiryDate, usageLimit, description } = req.body;

        const existingCoupon = await Coupon.findOne({ code: code }); // Already uppercased by validator

        if (existingCoupon) {
            return res.status(400).json({
                success: false,
                message: "A coupon with this code already exists.",
            });
        }

        const coupon = await Coupon.create({
            code,
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
        const coupons = await Coupon.find().sort({ createdAt: -1 });

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

        // Custom logic: if code is changing, check for conflicts
        if (req.body.code && req.body.code !== coupon.code) {
             const existingCoupon = await Coupon.findOne({ code: req.body.code });
             if (existingCoupon) {
                return res.status(400).json({
                    success: false,
                    message: "Another coupon with this code already exists.",
                });
            }
        }
        
        // Update fields provided in the request body
        Object.keys(req.body).forEach(key => {
            coupon[key] = req.body[key];
        });

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

        const coupon = await Coupon.findOne({ code: code }); // Already uppercased

        if (!coupon) {
            return res.status(404).json({ success: false, message: "Invalid coupon code." });
        }

        if (!coupon.isActive) {
            return res.status(400).json({ success: false, message: "This coupon is currently inactive." });
        }

        if (coupon.expiryDate < new Date()) {
            return res.status(400).json({ success: false, message: "This coupon has expired." });
        }

        if (coupon.usedCount >= coupon.usageLimit) {
            return res.status(400).json({ success: false, message: "This coupon has reached its usage limit." });
        }

        if (total < coupon.minimumAmount) {
            return res.status(400).json({
                success: false,
                message: `A minimum purchase of Rs. ${coupon.minimumAmount} is required to use this coupon.`,
            });
        }

        let discount = 0;
        if (coupon.type === "percentage") {
            discount = (total * coupon.value) / 100;
        } else {
            discount = coupon.value;
        }

        discount = Math.min(discount, total); // Discount cannot be more than the total

        return res.status(200).json({
            success: true,
            message: "Coupon applied successfully!",
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