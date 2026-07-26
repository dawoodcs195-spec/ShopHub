import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";

import { resetPassword } from "../../services/authService";
import Input from "../../components/forms/Input";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { token } = useParams();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (password !== confirmPassword) {
      const msg = "Passwords do not match.";
      setError(msg);
      toast.error(msg);
      return;
    }

    try {
      setLoading(true);

      const data = await resetPassword(token, password);

      setSuccess(data.message);
      toast.success(data.message);

      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (error) {
      const msg = error.response?.data?.message || "Failed to reset password.";
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
          Reset Password
        </h1>

        <p className="mt-3 text-sm sm:text-base text-text-secondary dark:text-dark-muted-foreground text-center leading-7">
          Choose a new password for your account.
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
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
          />

          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            minLength={6}
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white font-semibold py-3 rounded-xl shadow-soft hover:bg-primary-hover transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>

        <p className="text-center mt-6 text-sm text-text-secondary dark:text-dark-muted-foreground">
          <Link to="/login" className="text-primary font-semibold hover:underline">
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;