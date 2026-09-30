import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { Shield, Mail, Lock, AlertCircle, ArrowRight, Home, Eye, EyeOff } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const { loginAsAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please fill in admin email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginAsAdmin(email, password);
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      setErrorMessage(err.message || "Failed to log in as administrator.");
      toast.error(err.message || "Admin login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "radial-gradient(circle at top, rgba(245, 158, 11, 0.16) 0%, rgba(6, 9, 17, 1) 75%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "3rem 1rem",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Ambient glow */}
      <div
        style={{
          position: "absolute",
          width: "480px",
          height: "480px",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(245, 158, 11, 0.18) 0%, transparent 65%)",
          filter: "blur(60px)",
          top: "-60px",
          right: "10%",
          pointerEvents: "none"
        }}
      />

      <div style={{ width: "100%", maxWidth: "490px", position: "relative", zIndex: 1 }}>
        <div
          className="auth-card"
          style={{
            borderColor: "rgba(245, 158, 11, 0.3)",
            boxShadow: "0 24px 60px -10px rgba(0,0,0,0.7), 0 0 40px rgba(245, 158, 11, 0.15)"
          }}
        >
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div className="auth-icon-wrapper">
              <div
                style={{
                  position: "absolute",
                  inset: "-4px",
                  borderRadius: "20px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  opacity: 0.5,
                  filter: "blur(12px)"
                }}
              />
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  height: "100%",
                  borderRadius: "18px",
                  background: "linear-gradient(135deg, #f59e0b, #d97706)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(245, 158, 11, 0.45), inset 0 1px 1px rgba(255, 255, 255, 0.45)"
                }}
              >
                <Shield size={28} color="#fff" />
              </div>
            </div>
            <h1 style={{ fontSize: "1.85rem", fontWeight: 850, letterSpacing: "-0.02em" }}>
              Admin <span style={{ color: "#fbbf24" }}>Portal</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.925rem", marginTop: "6px" }}>
              Authorized management console for Oasis Pizza operations
            </p>
          </div>

          {/* Error message */}
          {errorMessage && (
            <div className="auth-alert-error">
              <AlertCircle size={20} style={{ flexShrink: 0 }} />
              <div style={{ fontWeight: 600 }}>{errorMessage}</div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group" style={{ marginBottom: "1.35rem" }}>
              <label className="form-label">Admin Email</label>
              <div className="auth-input-container">
                <Mail size={19} className="auth-input-icon" />
                <input
                  type="email"
                  className="auth-input-field"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: "1.35rem" }}>
              <label className="form-label">Password</label>
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

            <button
              type="submit"
              disabled={loading}
              className="auth-submit-btn"
              style={{
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 50%, #ea580c 100%)",
                boxShadow: "0 6px 22px rgba(245, 158, 11, 0.45)"
              }}
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
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Access Admin Console</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Return link */}
          <div style={{ marginTop: "1.75rem", textAlign: "center" }}>
            <Link
              to="/"
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
              <Home size={16} />
              <span>Back to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
