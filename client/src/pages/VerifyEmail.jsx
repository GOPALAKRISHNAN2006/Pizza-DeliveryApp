import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { verifyUserEmail } from "../services/authService";
import { useToast } from "../hooks/useToast";
import { CheckCircle2, AlertCircle, Loader2, ArrowRight, MailCheck } from "lucide-react";

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
    <div style={{ padding: "4rem 0", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: "480px" }}>
        <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
          {/* Header Icon */}
          <div
            style={{
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              background:
                status === "success"
                  ? "rgba(16, 185, 129, 0.15)"
                  : status === "error"
                  ? "rgba(239, 68, 68, 0.15)"
                  : "rgba(225, 29, 72, 0.15)",
              border: `2px solid ${
                status === "success" ? "#10b981" : status === "error" ? "#ef4444" : "var(--primary-500)"
              }`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem"
            }}
          >
            {status === "verifying" ? (
              <Loader2 size={32} color="var(--primary-400)" className="animate-spin" />
            ) : status === "success" ? (
              <CheckCircle2 size={36} color="#10b981" />
            ) : status === "error" ? (
              <AlertCircle size={36} color="#ef4444" />
            ) : (
              <MailCheck size={32} color="var(--primary-400)" />
            )}
          </div>

          <h1 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
            {status === "success"
              ? "Email Verified!"
              : status === "error"
              ? "Verification Failed"
              : "Account Email Verification"}
          </h1>

          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "2rem", lineHeight: 1.6 }}>
            {message || "Confirm your email address to unlock your account and start ordering handcrafted pizzas."}
          </p>

          {/* If verified successfully */}
          {status === "success" && (
            <Link to="/login" className="btn-primary" style={{ width: "100%", padding: "0.85rem", fontSize: "1rem" }}>
              <span>Log In to Oasis Pizza</span>
              <ArrowRight size={18} />
            </Link>
          )}

          {/* If error occurred */}
          {status === "error" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              <Link to="/register" className="btn-secondary" style={{ width: "100%", padding: "0.85rem" }}>
                Register Again
              </Link>
              <Link to="/login" style={{ color: "var(--primary-400)", fontSize: "0.875rem", fontWeight: 600 }}>
                Back to Login
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
              <div className="form-group" style={{ textAlign: "left" }}>
                <label className="form-label">Verification Token</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Paste your 64-character token here..."
                  value={manualToken}
                  onChange={(e) => setManualToken(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary"
                style={{ width: "100%", padding: "0.85rem", marginTop: "1rem" }}
              >
                {loading ? "Verifying..." : "Verify Token"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
