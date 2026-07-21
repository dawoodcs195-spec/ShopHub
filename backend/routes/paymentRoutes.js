const express = require("express");

const {
    createPaymentIntent,
    stripeWebhook,
} = require("../controllers/paymentController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ===============================
// Stripe Webhook
// No authentication is used here because Stripe,
// not a logged-in user, sends these requests.
// Signature verification inside the controller
// provides the security.
// ===============================
router.post(
    "/webhook",
    stripeWebhook
);

// ===============================
// Create Payment Intent
// ===============================
router.post(
    "/create-payment-intent",
    protect,
    createPaymentIntent
);

module.exports = router;