const crypto = require("crypto");
const bcrypt = require("bcryptjs");

const User = require("../models/User");
const {
    sendEmail,
} = require("../services/emailService");

// ===============================
// Forgot Password
// ===============================
const forgotPassword = async (
    req,
    res
) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: "Please provide your email.",
            });
        }

        const user = await User.findOne({
            email,
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found.",
            });
        }

        const resetToken =
            crypto.randomBytes(32).toString(
                "hex"
            );

        const hashedToken =
            crypto
                .createHash("sha256")
                .update(resetToken)
                .digest("hex");

        user.resetPasswordToken =
            hashedToken;

        user.resetPasswordExpire =
            Date.now() + 15 * 60 * 1000;

        await user.save();

        const resetUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password/${resetToken}`;

        const html = `
            <div style="font-family: Arial, sans-serif; max-width:600px; margin:auto;">
                <h2 style="color:#2563eb;">
                    Reset Your Password
                </h2>

                <p>
                    Hello <strong>${user.name}</strong>,
                </p>

                <p>
                    We received a request to reset your ShopHub password.
                </p>

                <p>
                    Click the button below to create a new password.
                </p>

                <p style="margin:30px 0;">
                    <a
                        href="${resetUrl}"
                        style="
                            background:#2563eb;
                            color:#fff;
                            text-decoration:none;
                            padding:12px 24px;
                            border-radius:6px;
                            display:inline-block;
                        "
                    >
                        Reset Password
                    </a>
                </p>

                <p>
                    This link will expire in
                    <strong>15 minutes</strong>.
                </p>

                <p>
                    If you did not request a password reset,
                    you can safely ignore this email.
                </p>

                <hr />

                <p style="color:#666;">
                    ShopHub Team
                </p>
            </div>
        `;

        await sendEmail({
            to: user.email,
            subject:
                "ShopHub Password Reset",
            html,
        });

        return res.status(200).json({
            success: true,
            message:
                "Password reset email sent successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

// ===============================
// Reset Password
// ===============================
const resetPassword = async (
    req,
    res
) => {
    try {
        const { password } = req.body;

        if (!password) {
            return res.status(400).json({
                success: false,
                message:
                    "Please provide a new password.",
            });
        }

        const hashedToken =
            crypto
                .createHash("sha256")
                .update(req.params.token)
                .digest("hex");

        const user =
            await User.findOne({
                resetPasswordToken:
                    hashedToken,
                resetPasswordExpire: {
                    $gt: Date.now(),
                },
            }).select("+password");

        if (!user) {
            return res.status(400).json({
                success: false,
                message:
                    "Password reset token is invalid or has expired.",
            });
        }

        const salt =
            await bcrypt.genSalt(10);

        user.password =
            await bcrypt.hash(
                password,
                salt
            );

        user.resetPasswordToken = "";
        user.resetPasswordExpire =
            undefined;

        await user.save();

        return res.status(200).json({
            success: true,
            message:
                "Password reset successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

module.exports = {
    forgotPassword,
    resetPassword,
};