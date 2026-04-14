import {
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
  Sparkles,
  User,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { api } from "../lib/api";

const authHighlights = [
  "Beautiful login and signup experience with premium spacing and strong hierarchy",
  "One secure workflow for both students and admins",
  "Direct access to dashboards, eligibility checks, and scholarship discovery",
];

const Login = () => {
  const navigate = useNavigate();
  const { updateUserState } = useAuth();
  const [tab, setTab] = useState("login");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showSignupPassword, setShowSignupPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loginInput, setLoginInput] = useState({ email: "", password: "" });
  const [forgotEmail, setForgotEmail] = useState("");
  const [signupInput, setSignupInput] = useState({
    email: "",
    username: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });

  const title = useMemo(() => {
    if (tab === "signup") return "Create your premium scholarship account";
    if (tab === "forgot") return "Reset access and continue smoothly";
    return "Welcome back to your scholarship workspace";
  }, [tab]);

  const subtitle = useMemo(() => {
    if (tab === "signup") {
      return "Create an account to unlock the eligibility checker, personalized dashboard, and a cleaner scholarship application journey.";
    }

    if (tab === "forgot") {
      return "Enter your email to receive a reset link so you can continue exploring scholarships securely.";
    }

    return "Sign in to continue with scholarship discovery, announcements, profile readiness, and questions from one refined dashboard.";
  }, [tab]);

  const handleSubmit = async (mode) => {
    const isLogin = mode === "login";
    const payload = isLogin ? loginInput : signupInput;

    if (!isLogin && signupInput.password !== signupInput.confirmPassword) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const response = await api.post(isLogin ? "/auth/login" : "/auth/signup", payload);
      if (response.data?.success) {
        if (isLogin) {
          updateUserState();
          toast.success(response.data.message || "Signed in successfully.");
          navigate(response.data.role === "admin" ? "/admin/dashboard" : "/user/dashboard");
        } else {
          toast.success("Account created successfully. Please sign in.");
          setLoginInput({ email: signupInput.email, password: "" });
          setTab("login");
        }
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("/auth/reset-password/", { email: forgotEmail });
      if (response.data?.success) {
        toast.success(response.data.message || "Reset link sent successfully.");
      } else {
        toast.error(response.data?.message || response.data?.Status || "Unable to send reset link.");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
        error.response?.data?.Status ||
        "Unable to send reset link."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell grid min-h-[calc(100vh-8rem)] gap-8 py-5 md:items-center xl:grid-cols-[1.04fr_0.96fr]">
      <section className="hero-card !bg-transparent overflow-hidden p-7 md:p-10 border border-white/10 shadow-[0_0_80px_rgba(139,92,246,0.15)] relative">
        {/* Gradient Overlay to fade into layout beautifully */}
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-[var(--surface-strong)]/30 to-[var(--bg)]/90" />
        
        <div className="relative z-10">
          <div className="section-eyebrow reveal-in">
            <ShieldCheck className="h-4 w-4" />
            Secure student and admin access
          </div>

        <h1 className="section-heading mt-5 reveal-in delay-1">{title}</h1>
        <p className="section-subtitle mt-6 reveal-in delay-2">{subtitle}</p>

        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {authHighlights.map((item, index) => (
            <article key={item} className={`metric-card reveal-in delay-${index + 1}`}>
              <span>Benefit {index + 1}</span>
              <strong className="!mt-4 !text-[1rem] !leading-7 !tracking-normal">{item}</strong>
            </article>
          ))}
        </div>

        <div className="section-card mt-8 rounded-[1.8rem] p-6">
          <div className="flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-[1rem] bg-[var(--primary-soft)] text-[var(--primary)]">
              <Sparkles className="h-7 w-7" />
            </div>
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.18em] text-[var(--ink-muted)]">
                Premium experience
              </p>
              <h2 className="display-font mt-1 text-2xl font-bold tracking-[-0.04em] text-[var(--ink)]">
                Beautiful, clear, and responsive
              </h2>
            </div>
          </div>
          <p className="mt-4 text-sm leading-7 text-[var(--ink-soft)]">
            The redesigned auth flow keeps the experience welcoming and trustworthy while preserving
            the backend-connected login, signup, and password reset behavior.
          </p>
        </div>
        </div>
      </section>

      <section className="section-card rounded-[2rem] p-6 md:p-8">
        <div className="grid grid-cols-3 gap-2 rounded-full bg-[var(--surface-muted)] p-1">
          {[
            { id: "login", label: "Login" },
            { id: "signup", label: "Sign Up" },
            { id: "forgot", label: "Forgot" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setTab(item.id)}
              className={`rounded-full px-4 py-3 text-sm font-extrabold transition ${tab === item.id
                  ? "bg-[var(--primary-soft)] border border-[var(--primary)] text-[var(--primary-strong)] shadow-[var(--shadow-xs)]"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
                }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {tab === "login" && (
          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit("login");
            }}
          >
            <label className="form-field">
              <span>Email or username</span>
              <div className="input-shell">
                <Mail className="h-5 w-5 text-[var(--ink-muted)]" />
                <input
                  value={loginInput.email}
                  onChange={(event) =>
                    setLoginInput((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="Enter your email or username"
                  required
                />
              </div>
            </label>

            <label className="form-field">
              <span>Password</span>
              <div className="input-shell">
                <Lock className="h-5 w-5 text-[var(--ink-muted)]" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={loginInput.password}
                  onChange={(event) =>
                    setLoginInput((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Enter your password"
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

            <div className="flex flex-col gap-3 sm:flex-row">
              <button className="primary-button flex-1" disabled={loading}>
                {loading ? "Signing in..." : "Sign In"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
              <button type="button" className="ghost-button" onClick={() => setTab("forgot")}>
                Forgot password
              </button>
            </div>
          </form>
        )}

        {tab === "signup" && (
          <form
            className="mt-8 space-y-5"
            onSubmit={(event) => {
              event.preventDefault();
              handleSubmit("signup");
            }}
          >
            <label className="form-field">
              <span>Email</span>
              <div className="input-shell">
                <Mail className="h-5 w-5 text-[var(--ink-muted)]" />
                <input
                  type="email"
                  value={signupInput.email}
                  onChange={(event) =>
                    setSignupInput((current) => ({ ...current, email: event.target.value }))
                  }
                  placeholder="Enter your email"
                  required
                />
              </div>
            </label>

            <label className="form-field">
              <span>Username</span>
              <div className="input-shell">
                <User className="h-5 w-5 text-[var(--ink-muted)]" />
                <input
                  value={signupInput.username}
                  onChange={(event) =>
                    setSignupInput((current) => ({ ...current, username: event.target.value }))
                  }
                  placeholder="Choose a username"
                  required
                />
              </div>
            </label>

            <label className="form-field">
              <span>Password</span>
              <div className="input-shell">
                <Lock className="h-5 w-5 text-[var(--ink-muted)]" />
                <input
                  type={showSignupPassword ? "text" : "password"}
                  value={signupInput.password}
                  onChange={(event) =>
                    setSignupInput((current) => ({ ...current, password: event.target.value }))
                  }
                  placeholder="Create a password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowSignupPassword((value) => !value)}
                  className="text-[var(--ink-muted)]"
                  aria-label={showSignupPassword ? "Hide password" : "Show password"}
                >
                  {showSignupPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </label>

            <label className="form-field">
              <span>Confirm password</span>
              <div className="input-shell">
                <KeyRound className="h-5 w-5 text-[var(--ink-muted)]" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  value={signupInput.confirmPassword}
                  onChange={(event) =>
                    setSignupInput((current) => ({
                      ...current,
                      confirmPassword: event.target.value,
                    }))
                  }
                  placeholder="Confirm your password"
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

            <button className="primary-button w-full" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>
          </form>
        )}

        {tab === "forgot" && (
          <form className="mt-8 space-y-5" onSubmit={handleForgotPassword}>
            <label className="form-field">
              <span>Email</span>
              <div className="input-shell">
                <Mail className="h-5 w-5 text-[var(--ink-muted)]" />
                <input
                  type="email"
                  value={forgotEmail}
                  onChange={(event) => setForgotEmail(event.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
              </div>
            </label>

            <button className="primary-button w-full" disabled={loading}>
              {loading ? "Sending reset link..." : "Send reset link"}
              {!loading && <ArrowRight className="h-4 w-4" />}
            </button>

            <p className="text-center text-sm text-[var(--ink-soft)]">
              Remembered your password?{" "}
              <button
                type="button"
                className="font-extrabold text-[var(--primary)]"
                onClick={() => setTab("login")}
              >
                Return to login
              </button>
            </p>
          </form>
        )}

        {/* Removed public link block */}
      </section>
    </div>
  );
};

export default Login;
