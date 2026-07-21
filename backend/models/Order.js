const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        orderItems: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },

                name: {
                    type: String,
                    required: true,
                },

                image: {
                    url: {
                        type: String,
                        default: "",
                    },

                    public_id: {
                        type: String,
                        default: "",
                    },
                },

                price: {
                    type: Number,
                    required: true,
                },

                quantity: {
                    type: Number,
                    required: true,
                },
            },
        ],

        shippingAddress: {
            fullName: {
                type: String,
                required: true,
            },

            phone: {
                type: String,
                required: true,
            },

            address: {
                type: String,
                required: true,
            },

            city: {
                type: String,
                required: true,
            },

            postalCode: {
                type: String,
                required: true,
            },

            country: {
                type: String,
                required: true,
            },
        },

        paymentMethod: {
            type: String,
            default: "Cash on Delivery",
        },

        itemsPrice: {
            type: Number,
            required: true,
        },

        shippingPrice: {
            type: Number,
            required: true,
            default: 0,
        },

        taxPrice: {
            type: Number,
            required: true,
            default: 0,
        },

        totalPrice: {
            type: Number,
            required: true,
        },

        orderStatus: {
            type: String,
            enum: [
                "Pending",
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled",
            ],
            default: "Pending",
        },

        isPaid: {
            type: Boolean,
            default: false,
        },

        paidAt: Date,

        isDelivered: {
            type: Boolean,
            default: false,
        },

        deliveredAt: Date,
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Order", orderSchema);