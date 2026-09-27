import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { UserPlus, User, Mail, Lock, AlertCircle, CheckCircle2, ArrowRight } from "lucide-react";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successInfo, setSuccessInfo] = useState(null);

  const { register } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

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
    <div style={{ padding: "4rem 0", minHeight: "80vh", display: "flex", alignItems: "center" }}>
      <div className="container" style={{ maxWidth: "480px" }}>
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
              <UserPlus size={26} color="#fff" />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Create Your Account</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "4px" }}>
              Join Oasis Pizza to build custom pizzas & get real-time order tracking
            </p>
          </div>

          {/* Success Screen */}
          {successInfo ? (
            <div style={{ textAlign: "center", padding: "1rem 0" }}>
              <div
                style={{
                  width: "64px",
                  height: "64px",
                  borderRadius: "50%",
                  background: "rgba(16, 185, 129, 0.15)",
                  border: "2px solid #10b981",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem"
                }}
              >
                <CheckCircle2 size={36} color="#10b981" />
              </div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 800, marginBottom: "0.75rem" }}>
                Verify Your Email
              </h3>
              <p style={{ color: "#cbd5e1", fontSize: "0.925rem", lineHeight: 1.6, marginBottom: "1.5rem" }}>
                {successInfo.message}
              </p>

              {successInfo.token && (
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
                    🚀 Fast Test Verification (Dev Mode):
                  </div>
                  <div style={{ color: "#94a3b8", fontSize: "0.75rem", marginBottom: "8px" }}>
                    Click below to verify immediately:
                  </div>
                  <Link
                    to={`/verify-email/${successInfo.token}`}
                    style={{ color: "#38bdf8", fontWeight: 700, wordBreak: "break-all" }}
                  >
                    Verify Email Automatically &rarr;
                  </Link>
                </div>
              )}

              <Link to="/login" className="btn-primary" style={{ width: "100%", padding: "0.85rem" }}>
                Proceed to Login
              </Link>
            </div>
          ) : (
            <>
              {/* Error Box */}
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

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      style={{ paddingLeft: "2.75rem" }}
                    />
                    <User size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                  </div>
                </div>

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

                <div className="form-group">
                  <label className="form-label">Password (min 6 characters)</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      style={{ paddingLeft: "2.75rem" }}
                    />
                    <Lock size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Confirm Password</label>
                  <div style={{ position: "relative" }}>
                    <input
                      type="password"
                      className="form-input"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={{ paddingLeft: "2.75rem" }}
                    />
                    <Lock size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-primary"
                  style={{ width: "100%", padding: "0.85rem", marginTop: "1rem", fontSize: "1rem" }}
                >
                  {loading ? "Creating Account..." : "Create Account"}
                  {!loading && <ArrowRight size={18} />}
                </button>
              </form>

              {/* Footer note */}
              <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "#94a3b8" }}>
                Already registered?{" "}
                <Link to="/login" style={{ color: "var(--primary-400)", fontWeight: 700 }}>
                  Sign In
                </Link>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
