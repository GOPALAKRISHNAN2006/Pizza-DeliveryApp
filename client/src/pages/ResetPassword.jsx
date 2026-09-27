import React, { useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { resetUserPassword } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { Lock, CheckCircle2, AlertCircle, ArrowRight } from "lucide-react";

const ResetPassword = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

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
    <div style={{ padding: "4rem 0", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: "460px" }}>
        <div className="glass-card" style={{ padding: "2.5rem" }}>
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
              <Lock size={26} color="#fff" />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Reset Password</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "4px" }}>
              Enter your new password below to secure your account
            </p>
          </div>

          {success ? (
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
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "0.5rem" }}>
                Password Updated!
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
                Your account password has been successfully updated.
              </p>
              <Link to="/login" className="btn-primary" style={{ width: "100%", padding: "0.85rem" }}>
                <span>Log In Now</span>
                <ArrowRight size={16} />
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
                  <label className="form-label">New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="form-input"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
                >
                  {loading ? "Updating..." : "Set New Password"}
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
