const Stripe = require("stripe");
const Order = require("../models/Order");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// ===============================
// Create Payment Intent
// ===============================
const createPaymentIntent = async (req, res) => {
    try {
        const { amount } = req.body;

        if (!amount || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid payment amount.",
            });
        }

        const paymentIntent =
            await stripe.paymentIntents.create({
                // Stripe expects the amount in the currency's smallest unit.
                // For USD, that's cents.
                amount: Math.round(Number(amount) * 100),
                currency: "usd",
                automatic_payment_methods: {
                    enabled: true,
                },
            });

        return res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Stripe Webhook
// ===============================
const stripeWebhook = async (req, res) => {
    const signature = req.headers["stripe-signature"];

    let event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return res.status(400).send(
            `Webhook Error: ${error.message}`
        );
    }

    try {
        switch (event.type) {
            case "payment_intent.succeeded": {
                const paymentIntent = event.data.object;

                const order = await Order.findOne({
                    transactionId: paymentIntent.id,
                });

                if (order && !order.isPaid) {
                    order.isPaid = true;
                    order.paymentStatus = "Paid";
                    order.paidAt = new Date();

                    await order.save();

                    console.log(
                        `✅ Order ${order._id} marked as paid via Stripe webhook.`
                    );
                }

                break;
            }

            case "payment_intent.payment_failed": {
                const paymentIntent = event.data.object;

                const order = await Order.findOne({
                    transactionId: paymentIntent.id,
                });

                if (order) {
                    order.paymentStatus = "Failed";

                    await order.save();

                    console.log(
                        `❌ Payment failed for order ${order._id}.`
                    );
                }

                break;
            }

            default:
                console.log(
                    `Unhandled Stripe event: ${event.type}`
                );
        }

        return res.status(200).json({
            received: true,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    createPaymentIntent,
    stripeWebhook,
};