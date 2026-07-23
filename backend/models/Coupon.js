const mongoose = require("mongoose");

// ===============================
// Coupon Schema
// ===============================
const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Coupon code is required"],
            unique: true,
            uppercase: true,
            trim: true,
        },

        type: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },

        value: {
            type: Number,
            required: true,
            min: 1,
        },

        minimumAmount: {
            type: Number,
            default: 0,
        },

        expiryDate: {
            type: Date,
            required: true,
        },

        usageLimit: {
            type: Number,
            default: 1,
        },

        usedCount: {
            type: Number,
            default: 0,
        },

        isActive: {
            type: Boolean,
            default: true,
        },

        description: {
            type: String,
            default: "",
            trim: true,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model(
    "Coupon",
    couponSchema
);