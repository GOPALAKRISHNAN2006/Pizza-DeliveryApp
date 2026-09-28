import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { verifyUserEmail } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, MailCheck, KeyRound } from "lucide-react";

const VerifyEmail = () => {
  const { token: urlToken } = useParams();
  const [manualToken, setManualToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle, verifying, success, error
  const [message, setMessage] = useState("");

  const toast = useToast();
  const navigate = useNavigate();

  const handleVerify = async (tokenToVerify) => {
    if (!tokenToVerify) {
      toast.error("Please provide a verification token");
      return;
    }

    setLoading(true);
    setStatus("verifying");
    setMessage("Verifying your email token with server...");

    try {
      const res = await verifyUserEmail(tokenToVerify);
      setStatus("success");
      setMessage(res.message || "Email verified successfully! You can now log in.");
      toast.success("Email verified successfully! 🍕");
    } catch (err) {
      console.error("Verification error:", err);
      setStatus("error");
      setMessage(err.message || "Failed to verify email token. The link may have expired.");
      toast.error(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (urlToken) {
      handleVerify(urlToken);
    }
  }, [urlToken]);

  return (
    <div className="auth-page-wrapper">
      {/* Background ambient glow */}
      <div className="auth-ambient-glow auth-ambient-glow-1" />
      <div className="auth-ambient-glow auth-ambient-glow-2" />
      <div className="auth-ambient-glow auth-ambient-glow-3" />

      <div className="container" style={{ maxWidth: "490px", position: "relative", zIndex: 1 }}>
        <div className="auth-card" style={{ textAlign: "center" }}>
          {/* Header Icon */}
          <div
            style={{
              width: "72px",
              height: "72px",
              borderRadius: "50%",
              background:
                status === "success"
                  ? "radial-gradient(circle, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.05) 70%)"
                  : status === "error"
                  ? "radial-gradient(circle, rgba(239, 68, 68, 0.25) 0%, rgba(239, 68, 68, 0.05) 70%)"
                  : "radial-gradient(circle, rgba(244, 63, 94, 0.25) 0%, rgba(244, 63, 94, 0.05) 70%)",
              border: `2px solid ${
                status === "success" ? "#10b981" : status === "error" ? "#ef4444" : "var(--primary-500)"
              }`,
              boxShadow: `0 0 25px ${
                status === "success"
                  ? "rgba(16, 185, 129, 0.4)"
                  : status === "error"
                  ? "rgba(239, 68, 68, 0.4)"
                  : "rgba(244, 63, 94, 0.4)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem"
            }}
          >
            {status === "verifying" ? (
              <Loader2 size={36} color="var(--primary-400)" className="animate-spin" />
            ) : status === "success" ? (
              <CheckCircle2 size={40} color="#10b981" />
            ) : status === "error" ? (
              <AlertCircle size={40} color="#ef4444" />
            ) : (
              <MailCheck size={36} color="var(--primary-400)" />
            )}
          </div>

          <h1 style={{ fontSize: "1.85rem", fontWeight: 850, letterSpacing: "-0.02em", marginBottom: "0.5rem" }}>
            {status === "success" ? (
              <>
                Email <span style={{ color: "#34d399" }}>Verified!</span>
              </>
            ) : status === "error" ? (
              <>
                Verification <span style={{ color: "#f87171" }}>Failed</span>
              </>
            ) : (
              <>
                Verify Your <span className="gradient-text">Email</span>
              </>
            )}
          </h1>

          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.6 }}>
            {message || "Confirm your email address to unlock your account and start ordering handcrafted pizzas."}
          </p>

          {/* If verified successfully */}
          {status === "success" && (
            <Link to="/login" className="auth-submit-btn" style={{ textDecoration: "none" }}>
              <span>Log In to Oasis Pizza</span>
              <ArrowRight size={18} />
            </Link>
          )}

          {/* If error occurred */}
          {status === "error" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link to="/register" className="auth-submit-btn" style={{ textDecoration: "none" }}>
                <span>Try Registering Again</span>
                <ArrowRight size={18} />
              </Link>
              <Link to="/login" style={{ color: "var(--primary-400)", fontSize: "0.875rem", fontWeight: 600 }}>
                Back to Sign In &rarr;
              </Link>
            </div>
          )}

          {/* If idle without URL token */}
          {status === "idle" && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify(manualToken);
              }}
            >
              <div className="form-group" style={{ textAlign: "left", marginBottom: "1.25rem" }}>
                <label className="form-label">Paste Verification Token</label>
                <div className="auth-input-container">
                  <KeyRound size={19} className="auth-input-icon" />
                  <input
                    type="text"
                    className="auth-input-field"
                    placeholder="Paste 64-character token here..."
                    value={manualToken}
                    onChange={(e) => setManualToken(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="auth-submit-btn"
              >
                {loading ? "Verifying Token..." : "Verify & Unlock Account"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
