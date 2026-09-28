import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotUserPassword } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { KeyRound, Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight, ShieldCheck, Flame } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [resetTokenDev, setResetTokenDev] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email) {
      setErrorMessage("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    try {
      const res = await forgotUserPassword(email);
      setSubmitted(true);
      if (res.resetTokenPreview) {
        setResetTokenDev(res.resetTokenPreview);
      }
      toast.success("Password reset instructions sent!");
    } catch (err) {
      console.error("Forgot password error:", err);
      setErrorMessage(err.message || "Failed to process request.");
      toast.error(err.message || "Failed to send reset link");
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
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div className="auth-icon-wrapper">
              <div className="auth-icon-halo" />
              <div className="auth-icon-box">
                <KeyRound size={28} color="#ffffff" />
              </div>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 850, letterSpacing: "-0.02em" }}>
              Forgot <span className="gradient-text">Password?</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.925rem", marginTop: "6px" }}>
              Enter your email and we'll send a secure password reset link
            </p>
          </div>

          {submitted ? (
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
              <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Check Your <span style={{ color: "#34d399" }}>Inbox</span>
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.925rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                If an account exists for <strong style={{ color: "#fb7185" }}>{email}</strong>, password reset instructions have been sent.
              </p>

              {resetTokenDev && (
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
                  <div style={{ color: "#fbbf24", fontWeight: 750, marginBottom: "4px" }}>
                    🚀 Dev Quick Reset:
                  </div>
                  <Link
                    to={`/reset-password/${resetTokenDev}`}
                    style={{ color: "#38bdf8", fontWeight: 700, wordBreak: "break-all" }}
                  >
                    Click to Reset Password Immediately &rarr;
                  </Link>
                </div>
              )}

              <Link
                to="/login"
                className="btn-secondary"
                style={{ width: "100%", padding: "0.85rem", display: "inline-flex", justifyContent: "center", gap: "8px" }}
              >
                <ArrowLeft size={16} />
                <span>Return to Login</span>
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
                <div className="form-group" style={{ marginBottom: "1.5rem" }}>
                  <label className="form-label">Registered Email Address</label>
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
                      <span>Sending Reset Link...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Recovery Instructions</span>
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>

              <div style={{ marginTop: "1.75rem", textAlign: "center" }}>
                <Link
                  to="/login"
                  style={{
                    color: "#94a3b8",
                    fontSize: "0.875rem",
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    fontWeight: 600,
                    transition: "color 0.2s"
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f8fafc")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#94a3b8")}
                >
                  <ArrowLeft size={16} />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
