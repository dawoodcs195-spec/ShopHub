const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Product name is required"],
            trim: true,
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

        brand: {
            type: String,
            default: "No Brand",
        },

        stock: {
            type: Number,
            required: true,
            default: 0,
        },

        image: {
            type: String,
            default: "",
        },

        rating: {
            type: Number,
            default: 0,
        },

        numReviews: {
            type: Number,
            default: 0,
        },

        createdBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Product", productSchema);