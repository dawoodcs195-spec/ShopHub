import { useState } from "react";
import {
    Link,
    useNavigate,
    useParams,
} from "react-router-dom";

import { resetPassword } from "../../services/authService";

const ResetPassword = () => {
    const navigate = useNavigate();

    const { token } = useParams();

    const [password, setPassword] =
        useState("");

    const [confirmPassword, setConfirmPassword] =
        useState("");

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

        if (password !== confirmPassword) {
            setError(
                "Passwords do not match."
            );
            return;
        }

        try {
            setLoading(true);

            const data =
                await resetPassword(
                    token,
                    password
                );

            setSuccess(data.message);

            setTimeout(() => {
                navigate("/login");
            }, 2000);
        } catch (error) {
            setError(
                error.response?.data
                    ?.message ||
                    "Failed to reset password."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white shadow-lg rounded-xl p-8">
            <h1 className="text-3xl font-bold text-center mb-6">
                Reset Password
            </h1>

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
                    type="password"
                    placeholder="New Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-lg"
                    required
                    minLength={6}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={
                        confirmPassword
                    }
                    onChange={(e) =>
                        setConfirmPassword(
                            e.target.value
                        )
                    }
                    className="w-full border p-3 rounded-lg"
                    required
                    minLength={6}
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                    {loading
                        ? "Updating..."
                        : "Reset Password"}
                </button>
            </form>

            <p className="text-center mt-6">
                <Link
                    to="/login"
                    className="text-blue-600 font-semibold"
                >
                    Back to Login
                </Link>
            </p>
        </div>
    );
};

export default ResetPassword;
