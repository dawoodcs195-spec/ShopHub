const mongoose = require("mongoose");

// ===============================
// Review Schema
// ===============================
const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        name: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true, trim: true },
    },
    {
        timestamps: true,
    }
);

// ===============================
// Product Schema
// ===============================
const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
            unique: true,
        },
        description: {
            type: String,
            required: [true, "Product description is required"],
        },
        price: {
            type: Number,
            required: [true, "Product price is required"],
        },
        category: {
            type: String,
            required: [true, "Product category is required"],
        },
        brand: { type: String, default: "Diya Expressions" },
        stock: { type: Number, required: true, default: 0 },

        // Cover image (for listing cards)
        image: {
            url: { type: String, default: "" },
            public_id: { type: String, default: "" },
        },

        // Gallery images (for product details)
        images: [
            {
                url: { type: String, default: "" },
                public_id: { type: String, default: "" },
            },
        ],

        reviews: [reviewSchema],
        rating: { type: Number, default: 0 },
        numReviews: { type: Number, default: 0 },
        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

// Add indexes for performance
productSchema.index({ category: 1 });
productSchema.index({ brand: 1 });
productSchema.index({ price: 1 });
productSchema.index({ rating: -1 });
productSchema.index({ createdAt: -1 });
// Text index for searching
productSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model("Product", productSchema);