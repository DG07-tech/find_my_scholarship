import { ArrowLeft, Eye, EyeOff, KeyRound, Lock, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api } from "../lib/api";

export default function ResetPassword() {
  const navigate = useNavigate();
  const { id, token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await api.post(`/auth/reset-password/${id}/${token}`, { password });
      if (response.data?.status === "success" || response.data?.success) {
        toast.success("Password updated successfully.");
        navigate("/login");
      } else {
        toast.error(response.data?.Status || "Unable to reset password.");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to reset password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="page-shell grid min-h-[calc(100vh-8rem)] gap-8 py-5 md:items-center xl:grid-cols-[0.95fr_1.05fr]">
      <section className="hero-card overflow-hidden p-7 md:p-10">
        <div className="section-eyebrow reveal-in">
          <ShieldCheck className="h-4 w-4" />
          Secure password reset
        </div>

        <h1 className="section-heading mt-5 reveal-in delay-1">
          Set a new password and return to your scholarship journey.
        </h1>
        <p className="section-subtitle mt-6 reveal-in delay-2">
          Choose a strong password to keep your dashboard, profile details, and scholarship activity
          safe and accessible.
        </p>

        <div className="section-card mt-8 rounded-[1.8rem] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]">
              <KeyRound className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                Password tip
              </p>
              <h2 className="display-font mt-1 text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                Use at least 6 characters
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            A secure and memorable password helps protect your account while keeping the experience
            simple.
          </p>
        </div>
      </section>

      <section className="section-card rounded-[2rem] p-6 md:p-8">
        <h2 className="display-font text-3xl font-bold tracking-[-0.04em] text-[var(--ink)]">
          Reset password
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
          Confirm your new password below to finish restoring access.
        </p>

        <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
          <label className="form-field">
            <span>New password</span>
            <div className="input-shell">
              <Lock className="h-5 w-5 text-[var(--ink-muted)]" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                className="text-[var(--ink-muted)]"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </label>

          <label className="form-field">
            <span>Confirm password</span>
            <div className="input-shell">
              <Lock className="h-5 w-5 text-[var(--ink-muted)]" />
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                placeholder="Confirm your new password"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword((value) => !value)}
                className="text-[var(--ink-muted)]"
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
            </div>
          </label>

          <button type="submit" disabled={isSubmitting} className="primary-button w-full">
            {isSubmitting ? "Updating password..." : "Update password"}
          </button>
        </form>

        <div className="mt-6">
          <Link to="/login" className="secondary-button w-full">
            <ArrowLeft className="h-4 w-4" />
            Back to login
          </Link>
        </div>
      </section>
    </div>
  );
}
