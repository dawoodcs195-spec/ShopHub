const nodemailer = require("nodemailer");

// ===============================
// Mail Transport
// ===============================
const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: Number(process.env.EMAIL_PORT),
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ===============================
// Send Email
// ===============================
const sendEmail = async ({
    to,
    subject,
    html,
}) => {
    await transporter.sendMail({
        from: process.env.EMAIL_FROM,
        to,
        subject,
        html,
    });
};

// ===============================
// Welcome Email
// ===============================
const sendWelcomeEmail = async (
    user
) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
            <h1 style="color:#2563eb;">
                Welcome to ShopHub 🎉
            </h1>

            <p>
                Hi <strong>${user.name}</strong>,
            </p>

            <p>
                Thank you for creating your ShopHub account.
            </p>

            <p>
                You can now browse products, save items to your wishlist,
                apply coupons, and place secure orders.
            </p>

            <hr />

            <p style="color:#666;">
                Happy Shopping!
                <br />
                <strong>ShopHub Team</strong>
            </p>
        </div>
    `;

    await sendEmail({
        to: user.email,
        subject: "Welcome to ShopHub",
        html,
    });
};

// ===============================
// Order Confirmation Email
// ===============================
const sendOrderConfirmationEmail =
    async (user, order) => {
        const items = order.orderItems
            .map(
                (item) => `
                    <li>
                        ${item.name} × ${item.quantity}
                    </li>
                `
            )
            .join("");

        const html = `
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
                <h2 style="color:#2563eb;">
                    Order Confirmed ✅
                </h2>

                <p>
                    Hello <strong>${user.name}</strong>,
                </p>

                <p>
                    Your order has been placed successfully.
                </p>

                <p>
                    <strong>Order ID:</strong>
                    ${order._id}
                </p>

                <ul>
                    ${items}
                </ul>

                <p>
                    <strong>Total:</strong>
                    Rs. ${order.totalPrice}
                </p>

                <p>
                    Thank you for shopping with ShopHub.
                </p>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: "Your ShopHub Order",
            html,
        });
    };

// ===============================
// Admin New Order Email
// ===============================
const sendAdminNewOrderEmail =
    async (user, order) => {
        const items = order.orderItems
            .map(
                (item) => `
                    <li>
                        ${item.name} × ${item.quantity}
                    </li>
                `
            )
            .join("");

        const html = `
            <div style="font-family: Arial, sans-serif; max-width:700px; margin:auto;">
                <h2 style="color:#2563eb;">
                    🛒 New Order Received
                </h2>

                <p>
                    A new order has been placed on ShopHub.
                </p>

                <hr />

                <p>
                    <strong>Customer:</strong>
                    ${user.name}
                </p>

                <p>
                    <strong>Email:</strong>
                    ${user.email}
                </p>

                <p>
                    <strong>Order ID:</strong>
                    ${order._id}
                </p>

                <p>
                    <strong>Payment Method:</strong>
                    ${order.paymentMethod}
                </p>

                <p>
                    <strong>Payment Status:</strong>
                    ${order.paymentStatus}
                </p>

                <p>
                    <strong>Total:</strong>
                    Rs. ${order.totalPrice}
                </p>

                ${
                    order.coupon
                        ? `
                        <p>
                            <strong>Coupon:</strong>
                            ${order.coupon}
                        </p>

                        <p>
                            <strong>Discount:</strong>
                            Rs. ${order.discount}
                        </p>
                    `
                        : ""
                }

                <h3>
                    Ordered Items
                </h3>

                <ul>
                    ${items}
                </ul>
            </div>
        `;

        await sendEmail({
            to: process.env.EMAIL_USER,
            subject: `🛒 New Order - ${order._id}`,
            html,
        });
    };

// ===============================
// Delivered Email
// ===============================
const sendDeliveredEmail =
    async (user, order) => {
        const html = `
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
                <h2 style="color:#16a34a;">
                    📦 Order Delivered
                </h2>

                <p>
                    Hello <strong>${user.name}</strong>,
                </p>

                <p>
                    Your order has been successfully delivered.
                </p>

                <p>
                    <strong>Order ID:</strong>
                    ${order._id}
                </p>

                <p>
                    Thank you for shopping with ShopHub.
                    We hope to see you again soon.
                </p>

                <hr />

                <p>
                    <strong>ShopHub Team</strong>
                </p>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject: "Your ShopHub Order Has Been Delivered",
            html,
        });
    };

module.exports = {
    sendEmail,
    sendWelcomeEmail,
    sendOrderConfirmationEmail,
    sendAdminNewOrderEmail,
    sendDeliveredEmail,
};