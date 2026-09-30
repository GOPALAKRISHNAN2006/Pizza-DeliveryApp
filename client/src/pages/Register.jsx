import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Eye,
  EyeOff,
  Sparkles,
  LogIn,
  Flame,
  Zap,
  ShieldCheck,
  Check,
  X
} from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);

  const { register } = useAuth();
  const toast = useToast();

  // Password strength calculation
  const strength = useMemo(() => {
    if (!password) return { score: 0, label: "", colorClass: "" };
    let score = 0;
    if (password.length >= 6) score += 1;
    if (password.length >= 8) score += 1;
    if (/[0-9]/.test(password) || /[^A-Za-z0-9]/.test(password)) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;

    let label = "Weak";
    let colorClass = "active-1";
    let colorHex = "#ef4444";

    if (score === 2) {
      label = "Fair";
      colorClass = "active-2";
      colorHex = "#f97316";
    } else if (score === 3) {
      label = "Good";
      colorClass = "active-3";
      colorHex = "#f59e0b";
    } else if (score >= 4) {
      label = "Strong & Secure";
      colorClass = "active-4";
      colorHex = "#10b981";
    }

    return { score, label, colorClass, colorHex };
  }, [password]);

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!name || !email || !password || !confirmPassword) {
      setErrorMessage("All fields are required.");
      return;
    }

    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await register(name, email, password);
      setSuccessInfo({
        message: res.message || "Registration successful! Please check your email for the verification link.",
        token: res.verificationTokenPreview
      });
    } catch (err) {
      console.error("Registration error:", err);
      setErrorMessage(err.message || "Registration failed. Please try again.");
      toast.error(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Dynamic Background Ambient Blobs */}
      <div className="auth-ambient-glow auth-ambient-glow-1" />
      <div className="auth-ambient-glow auth-ambient-glow-2" />
      <div className="auth-ambient-glow auth-ambient-glow-3" />

      <div className="container" style={{ maxWidth: "490px", position: "relative", zIndex: 1 }}>
        <div className="auth-card">
          {/* Top Switcher Segment */}
          <div className="auth-switcher-container">
            <Link to="/login" className="auth-switcher-tab">
              <LogIn size={16} />
              <span>Sign In</span>
            </Link>
            <div className="auth-switcher-tab active">
              <Sparkles size={16} />
              <span>Create Account</span>
            </div>
          </div>

          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div className="auth-icon-wrapper">
              <div className="auth-icon-halo" />
              <div className="auth-icon-box">
                <UserPlus size={28} color="#ffffff" />
              </div>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 850, letterSpacing: "-0.02em" }}>
              Join <span className="gradient-text">Oasis Pizza</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.925rem", marginTop: "6px" }}>
              Craft customized stone-baked pizzas with real-time tracking
            </p>
          </div>

          {/* Success Screen */}
          {successInfo ? (
            <div style={{ textAlign: "center", padding: "0.5rem 0" }}>
              <div
                style={{
                  width: "72px",
                  height: "72px",
                  borderRadius: "50%",
                  background: "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.05) 70%)",
                  border: "2px solid #10b981",
                  boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem"
                }}
              >
                <CheckCircle2 size={40} color="#10b981" />
              </div>

              <h3 style={{ fontSize: "1.45rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                Verify Your <span style={{ color: "#34d399" }}>Email</span>
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {successInfo.message}
              </p>

              {successInfo.token && (
                <div
                  style={{
                    padding: "1.1rem",
                    background: "rgba(10, 15, 28, 0.8)",
                    borderRadius: "14px",
                    border: "1px dashed rgba(245, 158, 11, 0.4)",
                    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
                    fontSize: "0.875rem",
                    marginBottom: "1.5rem",
                    textAlign: "left"
                  }}
                >
                  <div style={{ color: "#fbbf24", fontWeight: 750, display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                    <span>🚀 Fast Test Verification (Dev Mode):</span>
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "0.8rem", marginBottom: "8px" }}>
                    Click below to verify immediately in one click:
                  </div>
                  <Link
                    to={`/verify-email/${successInfo.token}`}
                    style={{
                      color: "#38bdf8",
                      fontWeight: 700,
                      wordBreak: "break-all",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px"
                    }}
                  >
                    <span>Verify Email Automatically &rarr;</span>
                  </Link>
                </div>
              )}

              <Link to="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
                <span>Proceed to Login</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <>
              {/* Error Box */}
              {errorMessage && (
                <div className="auth-alert-error">
                  <AlertCircle size={20} style={{ marginTop: "2px", flexShrink: 0 }} />
                  <div style={{ fontWeight: 600 }}>{errorMessage}</div>
                </div>
              )}

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Full Name</label>
                  <div className="auth-input-container">
                    <User size={19} className="auth-input-icon" />
                    <input
                      type="text"
                      className="auth-input-field"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Email Address</label>
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

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">Password</label>
                  <div className="auth-input-container">
                    <Lock size={19} className="auth-input-icon" />
                    <input
                      type={showPassword ? "text" : "password"}
                      className="auth-input-field"
                      placeholder="•••••••• (min 6 chars)"
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

                  {/* Real-time Password Strength Meter */}
                  {password.length > 0 && (
                    <div className="auth-strength-container">
                      <div className="auth-strength-bars">
                        {[1, 2, 3, 4].map((step) => (
                          <div
                            key={step}
                            className={`auth-strength-segment ${
                              step <= strength.score ? strength.colorClass : ""
                            }`}
                          />
                        ))}
                      </div>
                      <div className="auth-strength-meta">
                        <span style={{ color: "#94a3b8" }}>Password Strength:</span>
                        <span style={{ color: strength.colorHex, fontWeight: 700 }}>
                          {strength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label">Confirm Password</label>
                    {passwordsMatch && (
                      <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Check size={14} /> Passwords match
                      </span>
                    )}
                    {passwordsMismatch && (
                      <span style={{ fontSize: "0.75rem", color: "#fb923c", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <X size={14} /> Passwords do not match
                      </span>
                    )}
                  </div>
                  <div className="auth-input-container">
                    <Lock size={19} className="auth-input-icon" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      className="auth-input-field"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{
                        paddingRight: "2.75rem",
                        borderColor: passwordsMatch
                          ? "rgba(16, 185, 129, 0.5)"
                          : passwordsMismatch
                          ? "rgba(249, 115, 22, 0.5)"
                          : undefined
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="auth-password-toggle"
                      title={showConfirmPassword ? "Hide password" : "Show password"}
                    >
                      {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
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
                      <span>Creating Account...</span>
                    </>
                  ) : (
                    <>
                      <span>Create Your Oasis Account</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              {/* Footer note */}
              <div style={{ marginTop: "1.75rem", textAlign: "center", fontSize: "0.885rem", color: "#94a3b8" }}>
                Already registered with us?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#fb7185",
                    fontWeight: 700,
                    textDecoration: "none"
                  }}
                  onMouseEnter={(e) => (e.target.style.textDecoration = "underline")}
                  onMouseLeave={(e) => (e.target.style.textDecoration = "none")}
                >
                  Sign In &rarr;
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
                  <span>Live Visualizer</span>
                </span>
                <span className="auth-perk-chip">
                  <ShieldCheck size={13} color="#10b981" />
                  <span>100% Encrypted</span>
                </span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
