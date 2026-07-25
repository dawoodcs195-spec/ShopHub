import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { loginUser } from "../../services/authService";
import { useAuth } from "../../context/AuthContext";
import Input from "../../components/forms/Input"; // Use our new reusable Input component

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await loginUser(formData.email, formData.password);
      login(data.user, data.token);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/");
    } catch (err) {
      toast.error(
        err.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background p-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 shadow-soft-lg rounded-xl overflow-hidden border border-border dark:border-dark-border bg-card dark:bg-dark-card">
        {/* Decorative Panel */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center bg-primary/20 dark:bg-dark-accent/20 p-12 text-center"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="font-serif text-4xl font-bold text-text-primary dark:text-dark-card-foreground mb-4">
            Welcome Back
          </h2>
          <p className="text-text-secondary dark:text-dark-muted-foreground">
            Log in to continue your journey and explore more handcrafted
            creations.
          </p>
        </motion.div>

        {/* Form Panel */}
        <motion.div
          className="bg-surface dark:bg-dark-card p-8 sm:p-12"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-3xl font-serif font-bold text-text-primary dark:text-dark-card-foreground text-center mb-8">
            Login to Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="email"
              name="email"
              placeholder="Email Address"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <Input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />

            <div className="text-right">
              <Link
                to="/forgot-password"
                className="text-sm text-primary hover:underline"
              >
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-soft hover:bg-primary-hover transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="text-center text-text-secondary dark:text-dark-muted-foreground mt-8">
            Don't have an account?{" "}
            <Link to="/register" className="text-primary font-semibold hover:underline">
              Create one
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;