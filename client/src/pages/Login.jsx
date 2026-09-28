import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, Eye, EyeOff, Sparkles, ShieldCheck, Flame, Zap } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setUnverifiedEmail(false);

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      if (err.message && err.message.toLowerCase().includes("verify your email")) {
        setUnverifiedEmail(true);
      }
      setErrorMessage(err.message || "Failed to log in. Please check your credentials.");
      toast.error(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Dynamic Background Glow Blobs */}
      <div className="auth-ambient-glow auth-ambient-glow-1" />
      <div className="auth-ambient-glow auth-ambient-glow-2" />
      <div className="auth-ambient-glow auth-ambient-glow-3" />

      <div className="container" style={{ maxWidth: "490px", position: "relative", zIndex: 1 }}>
        <div className="auth-card">
          {/* Top Switcher Segment */}
          <div className="auth-switcher-container">
            <div className="auth-switcher-tab active">
              <LogIn size={16} />
              <span>Sign In</span>
            </div>
            <Link to="/register" className="auth-switcher-tab">
              <Sparkles size={16} />
              <span>Create Account</span>
            </Link>
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div className="auth-icon-wrapper">
              <div className="auth-icon-halo" />
              <div className="auth-icon-box">
                <LogIn size={28} color="#ffffff" />
              </div>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 850, letterSpacing: "-0.02em" }}>
              Welcome <span className="gradient-text">Back</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.925rem", marginTop: "6px" }}>
              Sign in to customize pizzas & track live stone-oven orders
            </p>
          </div>

          {/* Error / Alert Box */}
          {errorMessage && (
            <div className="auth-alert-error">
              <AlertCircle size={20} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div style={{ fontWeight: 600 }}>{errorMessage}</div>
                {unverifiedEmail && (
                  <div style={{ marginTop: "8px" }}>
                    <Link
                      to="/verify-email"
                      style={{
                        color: "#fb7185",
                        fontWeight: 700,
                        textDecoration: "underline",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <span>Go to Email Verification Page</span>
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "1.35rem" }}>
              <label className="form-label" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span>Email Address</span>
              </label>
              <div className="auth-input-container">
                <Mail size={19} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input-field"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label">Password</label>
                <Link
                  to="/forgot-password"
                  style={{
                    fontSize: "0.825rem",
                    color: "var(--primary-400)",
                    fontWeight: 600,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => (e.target.style.color = "#fb923c")}
                  onMouseLeave={(e) => (e.target.style.color = "var(--primary-400)")}
                >
                  Forgot Password?
                </Link>
              </div>
              <div className="auth-input-container">
                <Lock size={19} className="auth-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="auth-input-field"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.85rem 0 1.25rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.85rem",
                  color: "#cbd5e1",
                  cursor: "pointer",
                  userSelect: "none"
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{
                    accentColor: "var(--primary-500)",
                    width: "16px",
                    height: "16px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                />
                <span>Remember my session</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
            >
              {loading ? (
                <>
                  <span
                    style={{
                      width: "18px",
                      height: "18px",
                      border: "2.5px solid rgba(255,255,255,0.3)",
                      borderTopColor: "#fff",
                      borderRadius: "50%",
                      display: "inline-block",
                      animation: "spin 0.8s linear infinite"
                    }}
                  />
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Oasis Pizza</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: "1.75rem", textAlign: "center", fontSize: "0.885rem", color: "#94a3b8" }}>
            New to Oasis Pizza?{" "}
            <Link
              to="/register"
              style={{
                color: "#fb7185",
                fontWeight: 700,
                textDecoration: "none"
              }}
              onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
              onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
            >
              Create an Account &rarr;
            </Link>
          </div>

          {/* Perks Bar */}
          <div className="auth-perks-row">
            <span className="auth-perk-chip">
              <Flame size={13} color="#f97316" />
              <span>Stone Oven Fresh</span>
            </span>
            <span className="auth-perk-chip">
              <Zap size={13} color="#fbbf24" />
              <span>30-Min Live Tracking</span>
            </span>
            <span className="auth-perk-chip">
              <ShieldCheck size={13} color="#10b981" />
              <span>100% Secure Auth</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
