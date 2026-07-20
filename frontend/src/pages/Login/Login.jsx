import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setLoading(true);

        try {
            const data = await loginUser(
                formData.email,
                formData.password
            );

            login(data.user, data.token);

            navigate("/");

        } catch (err) {
            setError(
                err.response?.data?.message || "Login failed."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white shadow-lg rounded-xl p-8">

            <h1 className="text-3xl font-bold text-center mb-6">
                Login
            </h1>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">

                <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    required
                />

                <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    required
                />

                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700"
                >
                    {loading ? "Logging in..." : "Login"}
                </button>

            </form>

            <p className="text-center mt-5">
                Don't have an account?{" "}
                <Link
                    to="/register"
                    className="text-blue-600 font-semibold"
                >
                    Register
                </Link>
            </p>

        </div>
    );
};

export default Login;