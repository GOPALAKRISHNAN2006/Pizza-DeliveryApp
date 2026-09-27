import React, { useState } from "react";
import { Link } from "react-router-dom";
import { forgotUserPassword } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { KeyRound, Mail, ArrowLeft, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

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
    <div style={{ padding: "4rem 0", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: "460px" }}>
        <div className="glass-card" style={{ padding: "2.5rem" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, var(--primary-600), var(--accent-orange))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 0 20px rgba(225, 29, 72, 0.4)"
              }}
            >
              <KeyRound size={26} color="#fff" />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Forgot Password</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "4px" }}>
              Enter your email and we'll send a link to reset your password
            </p>
          </div>

          {submitted ? (
            <div style={{ textAlign: "center" }}>
              <div
                style={{
                  width: "60px",
                  height: "60px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "2px solid #10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.25rem"
                }}
              >
                <CheckCircle2 size={32} color="#10b981" />
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Check Your Inbox
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                If an account exists with <strong>{email}</strong>, a secure password reset link has been dispatched.
              </p>

              {resetTokenDev && (
                <div
                  style={{
                    padding: "1rem",
                    background: "rgba(0,0,0,0.3)",
                    borderRadius: "8px",
                    border: "1px dashed rgba(255,255,255,0.15)",
                    fontSize: "0.85rem",
                    marginBottom: "1.5rem",
                    textAlign: "left"
                  }}
                >
                  <div style={{ color: "#fbbf24", fontWeight: 700, marginBottom: "4px" }}>
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

              <Link to="/login" className="btn-secondary" style={{ width: "100%", padding: "0.85rem" }}>
                <ArrowLeft size={16} />
                <span>Return to Login</span>
              </Link>
            </div>
          ) : (
            <>
              {errorMessage && (
                <div
                  style={{
                    padding: "0.85rem 1rem",
                    borderRadius: "10px",
                    background: "rgba(239, 68, 68, 0.12)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    color: "#fca5a5",
                    fontSize: "0.875rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px"
                  }}
                >
                  <AlertCircle size={18} style={{ flexShrink: 0 }} />
                  <div>{errorMessage}</div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="email"
                      className="form-input"
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      style={{ paddingLeft: "2.75rem" }}
                    />
                    <Mail size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              <div style={{ marginTop: "1.5rem", textAlign: "center" }}>
                <Link to="/login" style={{ color: "#94a3b8", fontSize: "0.875rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
                  <ArrowLeft size={16} />
                  <span>Back to Login</span>
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
