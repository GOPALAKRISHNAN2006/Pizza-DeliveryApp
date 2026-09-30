import React, { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { resetUserPassword } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { Lock, CheckCircle2, AlertCircle, ArrowRight, Eye, EyeOff, Check, X } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

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

    if (!password || !confirmPassword) {
      setErrorMessage("Please fill in both password fields.");
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
      await resetUserPassword(token, password);
      setSuccess(true);
      toast.success("Password reset successful! You can now log in.");
    } catch (err) {
      console.error("Reset password error:", err);
      setErrorMessage(err.message || "Failed to reset password. Link may have expired.");
      toast.error(err.message || "Reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-wrapper">
      {/* Background ambient glow */}
      <div className="auth-ambient-glow auth-ambient-glow-1" />
      <div className="auth-ambient-glow auth-ambient-glow-2" />
      <div className="auth-ambient-glow auth-ambient-glow-3" />

      <div className="container" style={{ maxWidth: "490px", position: "relative", zIndex: 1 }}>
        <div className="auth-card">
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div className="auth-icon-wrapper">
              <div className="auth-icon-halo" />
              <div className="auth-icon-box">
                <Lock size={28} color="#ffffff" />
              </div>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 850, letterSpacing: "-0.02em" }}>
              Reset <span className="gradient-text">Password</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.925rem", marginTop: "6px" }}>
              Choose a strong new password to secure your account
            </p>
          </div>

          {success ? (
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
                  margin: "0 auto 1.25rem"
                }}
              >
                <CheckCircle2 size={40} color="#10b981" />
              </div>
              <h3 style={{ fontSize: "1.4rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Password <span style={{ color: "#34d399" }}>Updated!</span>
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.95rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                Your account password has been successfully updated. You can now log in.
              </p>
              <Link to="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
                <span>Log In Now</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div className="auth-alert-error">
                  <AlertCircle size={20} style={{ flexShrink: 0 }} />
                  <div style={{ fontWeight: 600 }}>{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <label className="form-label">New Password</label>
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
                        <span style={{ color: "#94a3b8" }}>Strength:</span>
                        <span style={{ color: strength.colorHex, fontWeight: 700 }}>
                          {strength.label}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="form-group" style={{ marginBottom: "1.25rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <label className="form-label">Confirm New Password</label>
                    {passwordsMatch && (
                      <span style={{ fontSize: "0.75rem", color: "#34d399", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                        <Check size={14} /> Match
                      </span>
                    )}
                    {passwordsMismatch && (
                      <span style={{ fontSize: "0.75rem", color: "#fb923c", fontWeight: 600, display: "flex", alignItems: "center", gap: "4px" }}>
                        <X size={14} /> Mismatch
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
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <span>Set New Secure Password</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
