import { useState } from "react";
import { Link } from "react-router-dom";

import { forgotPassword } from "../../services/authService";

const ForgotPassword = () => {
    const [email, setEmail] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        try {
            setLoading(true);

            const data =
                await forgotPassword(email);

            setSuccess(data.message);
            setEmail("");
        } catch (error) {
            setError(
                error.response?.data
                    ?.message ||
                    "Failed to send password reset email."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white shadow-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-6">
                Forgot Password
            </h1>

            <p className="text-gray-600 text-center mb-6">
                Enter your registered email address.
                We'll send you a password reset link.
            </p>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <input
                    type="email"
                    placeholder="Email Address"
                    value={email}
                    onChange={(e) =>
                        setEmail(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-lg"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading
                        ? "Sending..."
                        : "Send Reset Link"}
                </button>
            </form>

            <p className="text-center mt-6">
                Remember your password?{" "}
                <Link
                    to="/login"
                    className="text-blue-600 font-semibold"
                >
                    Login
                </Link>
            </p>
        </div>
    );
};

export default ForgotPassword;