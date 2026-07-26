import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

import { registerUser } from "../../services/authService";
import Input from "../../components/forms/Input";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await registerUser(formData.name, formData.email, formData.password);
      toast.success("Registration successful! Please log in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background dark:bg-dark-background p-4">
      <div className="max-w-4xl w-full grid lg:grid-cols-2 shadow-soft-lg rounded-xl overflow-hidden border border-border dark:border-dark-border bg-card dark:bg-dark-card">
        {/* Form Panel */}
        <motion.div
          className="bg-surface dark:bg-dark-card p-6 sm:p-10 lg:p-12"
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary dark:text-dark-card-foreground text-center mb-8">
            Create Your Account
          </h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <Input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
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
            <Input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary text-white font-semibold py-3 rounded-lg shadow-soft hover:bg-primary-hover transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {loading ? "Creating Account..." : "Register"}
            </button>
          </form>

          <p className="text-center text-text-secondary dark:text-dark-muted-foreground mt-8">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">
              Log in
            </Link>
          </p>
        </motion.div>

        {/* Decorative Panel */}
        <motion.div
          className="hidden lg:flex flex-col items-center justify-center bg-primary/20 dark:bg-dark-accent/20 p-10 lg:p-12 text-center"
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
        >
          <h2 className="font-serif text-4xl font-bold text-text-primary dark:text-dark-card-foreground mb-4">
            Join Our Community
          </h2>
          <p className="text-text-secondary dark:text-dark-muted-foreground">
            Become a part of our creative world and start your collection of beautiful,
            handcrafted art.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Register;