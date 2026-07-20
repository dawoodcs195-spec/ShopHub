import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { registerUser } from "../../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
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

        setLoading(true);
        setError("");

        try {
            await registerUser(
                formData.name,
                formData.email,
                formData.password
            );

            alert("Registration Successful");

            navigate("/login");

        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Registration Failed"
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-md mx-auto mt-16 bg-white shadow-lg rounded-xl p-8">

            <h1 className="text-3xl font-bold text-center mb-6">
                Register
            </h1>

            {error && (
                <div className="bg-red-100 text-red-600 p-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >

                <input
                    type="text"
                    name="name"
                    placeholder="Full Name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full border p-3 rounded-lg"
                    required
                />

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
                    className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700"
                >
                    {loading
                        ? "Creating Account..."
                        : "Register"}
                </button>

            </form>

            <p className="text-center mt-5">

                Already have an account?

                <Link
                    to="/login"
                    className="text-blue-600 font-semibold ml-2"
                >
                    Login
                </Link>

            </p>

        </div>
    );
};

export default Register;