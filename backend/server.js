require("dotenv").config();

const express = require("express");
const cors = require("cors");

const connectDB = require("./config/db");

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const orderRoutes = require("./routes/orderRoutes");
const adminRoutes = require("./routes/adminRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

const app = express();

// Connect Database
connectDB();

// Middleware
app.use(cors());

// Stripe webhooks require the raw request body.
// Register this BEFORE express.json() so the webhook
// can verify Stripe's signature.
app.use(
    "/api/payments/webhook",
    express.raw({ type: "application/json" })
);

// JSON parser for the rest of the API
app.use(express.json());

// Routes
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payments", paymentRoutes);

// Test Route
app.get("/", (req, res) => {
    res.send("ShopHub Backend API is Running...");
});

// 404 Handler
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found.",
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ Server is running on port ${PORT}`);
});