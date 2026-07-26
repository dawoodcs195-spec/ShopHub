import { useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

import { forgotPassword } from "../../services/authService";
import Input from "../../components/forms/Input";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    try {
      setLoading(true);

      const data = await forgotPassword(email);

      setSuccess(data.message);
      toast.success(data.message);
      setEmail("");
    } catch (error) {
      const msg =
        error.response?.data?.message || "Failed to send password reset email.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background dark:bg-dark-background flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-md bg-card dark:bg-dark-card border border-border dark:border-dark-border shadow-soft-lg rounded-2xl p-6 sm:p-8">
        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-text-primary dark:text-dark-card-foreground text-center">
          Forgot Password
        </h1>

        <p className="mt-3 text-sm sm:text-base text-text-secondary dark:text-dark-muted-foreground text-center leading-7">
          Enter your registered email address. We’ll send you a password reset link.
        </p>

        {error && (
          <div className="mt-6 rounded-xl border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {success && (
          <div className="mt-6 rounded-xl border border-green-500/20 bg-green-500/10 px-4 py-3 text-sm text-green-700 dark:text-emerald-300">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-soft hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-text-secondary dark:text-dark-muted-foreground">
          Remember your password?{" "}
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;