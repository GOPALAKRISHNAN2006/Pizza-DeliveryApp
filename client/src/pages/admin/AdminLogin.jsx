import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import {
  Shield,
  ShieldCheck,
  Mail,
  Lock,
  AlertCircle,
  ArrowRight,
  Home,
  Eye,
  EyeOff,
  Zap,
  KeyRound,
  CheckCircle2,
  Server,
  HelpCircle,
  X,
  Fingerprint,
  Info
} from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [capsLockActive, setCapsLockActive] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [quickFilled, setQuickFilled] = useState(false);

  const { loginAsAdmin } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  // Listen for Caps Lock state
  const handleKeyUp = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const handleKeyDown = (e) => {
    if (e.getModifierState) {
      setCapsLockActive(e.getModifierState("CapsLock"));
    }
  };

  const handleQuickFill = () => {
    setEmail("admin@oasispizza.com");
    setPassword("Admin@12345");
    setErrorMessage("");
    setQuickFilled(true);
    toast.info("Demo credentials loaded!");
    setTimeout(() => setQuickFilled(false), 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!email || !password) {
      setErrorMessage("Please enter both administrator email and password.");
      return;
    }

    setLoading(true);
    try {
      await loginAsAdmin(email, password);
      toast.success("Administrator access verified. Welcome!");
      navigate("/admin/dashboard");
    } catch (err) {
      console.error("Admin login error:", err);
      const msg = err.response?.data?.message || err.message || "Failed to log in as administrator.";
      setErrorMessage(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-auth-wrapper">
      {/* Dynamic Cyber Grid Background */}
      <div className="admin-grid-pattern" />

      {/* Ambient Lighting Orbs */}
      <div className="admin-ambient-glow-1" />
      <div className="admin-ambient-glow-2" />

      <div style={{ width: "100%", maxWidth: "510px", position: "relative", zIndex: 1 }}>
        <div className="admin-auth-card">
          {/* Top Security Status Pill */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <div className="admin-status-pill">
              <span className="admin-status-dot" />
              <span>Oasis Secure Gateway v2.4</span>
            </div>
            <button
              type="button"
              onClick={() => setShowHelpModal(true)}
              style={{
                background: "transparent",
                border: "none",
                color: "#94a3b8",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontSize: "0.75rem",
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 8px",
                borderRadius: "6px",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#fbbf24";
                e.currentTarget.style.background = "rgba(245, 158, 11, 0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <HelpCircle size={14} />
              <span>Security Protocols</span>
            </button>
          </div>

          {/* Brand Header */}
          <div style={{ textAlign: "center", marginBottom: "1.75rem" }}>
            <div className="auth-icon-wrapper" style={{ width: "64px", height: "64px" }}>
              <div className="admin-icon-halo" />
              <div className="admin-icon-box">
                <Shield size={32} color="#ffffff" strokeWidth={2.2} />
              </div>
            </div>
            <h1 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.025em", color: "#f8fafc" }}>
              Admin <span style={{ color: "#fbbf24" }}>Console</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.925rem", marginTop: "6px", lineHeight: 1.5 }}>
              Restricted management portal for Oasis Pizza orders, kitchen pipeline & inventory controls
            </p>
          </div>

          {/* Quick Demo Credentials Assistant Box */}
          <div className="admin-quick-fill-box">
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <Zap size={16} color="#fbbf24" />
              <div style={{ fontSize: "0.8rem", color: "#e2e8f0" }}>
                <span style={{ fontWeight: 700, color: "#fbbf24" }}>Demo Evaluation?</span> Auto-fill admin credentials
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickFill}
              className="admin-quick-fill-btn"
              title="Click to fill default admin credentials"
            >
              {quickFilled ? (
                <>
                  <CheckCircle2 size={13} />
                  <span>Filled!</span>
                </>
              ) : (
                <>
                  <Zap size={13} />
                  <span>Fill Demo</span>
                </>
              )}
            </button>
          </div>

          {/* Error message Alert Box */}
          {errorMessage && (
            <div className="auth-alert-error" style={{ borderColor: "rgba(239, 68, 68, 0.45)", background: "rgba(239, 68, 68, 0.15)" }}>
              <AlertCircle size={20} style={{ flexShrink: 0, marginTop: "2px" }} />
              <div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>Authentication Failed</div>
                <div style={{ fontSize: "0.825rem", marginTop: "2px", opacity: 0.95 }}>{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} onKeyUp={handleKeyUp}>
            {/* Email Field */}
            <div className="form-group" style={{ marginBottom: "1.35rem" }}>
              <label className="form-label" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, color: "#e2e8f0" }}>Administrator Email</span>
                <span style={{ fontSize: "0.725rem", color: "#64748b", fontWeight: 500 }}>System ID format</span>
              </label>
              <div className="admin-input-container">
                <Mail size={19} className="admin-input-icon" />
                <input
                  type="email"
                  className="admin-input-field"
                  placeholder="admin@oasispizza.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  autoFocus
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="form-group" style={{ marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
                <label className="form-label" style={{ margin: 0, fontWeight: 600, color: "#e2e8f0" }}>
                  Security Key / Password
                </label>
                {capsLockActive && (
                  <span className="admin-capslock-pill">
                    <AlertCircle size={12} />
                    <span>Caps Lock is ON</span>
                  </span>
                )}
              </div>
              <div className="admin-input-container">
                <Lock size={19} className="admin-input-icon" />
                <input
                  type={showPassword ? "text" : "password"}
                  className="admin-input-field"
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  style={{ paddingRight: "2.75rem" }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="auth-password-toggle"
                  title={showPassword ? "Hide password" : "Show password"}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={18} color="#fbbf24" /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Session Duration */}
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "0.75rem 0 1.25rem" }}>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  fontSize: "0.825rem",
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
                    accentColor: "#f59e0b",
                    width: "16px",
                    height: "16px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                />
                <span>Persist 7-day administrative session</span>
              </label>

              <button
                type="button"
                onClick={() => setShowHelpModal(true)}
                style={{
                  background: "transparent",
                  border: "none",
                  fontSize: "0.825rem",
                  color: "#fbbf24",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0
                }}
              >
                Need Access?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="admin-submit-btn"
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
                  <span>Verifying Administrator Credentials...</span>
                </>
              ) : (
                <>
                  <KeyRound size={18} />
                  <span>Authorize & Open Admin Console</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Storefront Return Link */}
          <div style={{ marginTop: "1.75rem", textAlign: "center" }}>
            <Link
              to="/"
              style={{
                color: "#94a3b8",
                fontSize: "0.875rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                fontWeight: 600,
                padding: "6px 14px",
                borderRadius: "8px",
                background: "rgba(255, 255, 255, 0.03)",
                border: "1px solid rgba(255, 255, 255, 0.08)",
                transition: "all 0.25s ease"
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "#f8fafc";
                e.currentTarget.style.borderColor = "rgba(245, 158, 11, 0.4)";
                e.currentTarget.style.background = "rgba(245, 158, 11, 0.08)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "#94a3b8";
                e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
              }}
            >
              <Home size={15} />
              <span>Back to Customer Storefront</span>
            </Link>
          </div>

          {/* Security Audit Badges */}
          <div className="admin-security-footer">
            <span className="admin-security-tag">
              <ShieldCheck size={13} color="#10b981" />
              <span>256-Bit TLS</span>
            </span>
            <span className="admin-security-tag">
              <Fingerprint size={13} color="#fbbf24" />
              <span>Role Enforced</span>
            </span>
            <span className="admin-security-tag">
              <Server size={13} color="#60a5fa" />
              <span>Audit Logged</span>
            </span>
          </div>
        </div>
      </div>

      {/* Security Protocols & Help Modal */}
      {showHelpModal && (
        <div className="admin-help-modal-overlay" onClick={() => setShowHelpModal(false)}>
          <div className="admin-help-modal" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div
                  style={{
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    background: "linear-gradient(135deg, #f59e0b, #d97706)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <Shield size={20} color="#fff" />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.15rem", fontWeight: 800, color: "#fff" }}>Security & Access Notice</h3>
                  <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>Oasis Pizza Corporate Governance</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowHelpModal(false)}
                style={{
                  background: "rgba(255, 255, 255, 0.06)",
                  border: "none",
                  color: "#94a3b8",
                  cursor: "pointer",
                  borderRadius: "8px",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <X size={18} />
              </button>
            </div>

            <div style={{ color: "#cbd5e1", fontSize: "0.875rem", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "10px", background: "rgba(245, 158, 11, 0.06)", padding: "0.85rem", borderRadius: "10px", border: "1px solid rgba(245, 158, 11, 0.2)" }}>
                <Info size={18} color="#fbbf24" style={{ flexShrink: 0, marginTop: "2px" }} />
                <div>
                  <div style={{ fontWeight: 700, color: "#fbbf24", marginBottom: "2px" }}>Restricted Access Policy</div>
                  This gateway is exclusively intended for authorized store operators, kitchen managers, and system administrators.
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Default Demonstration Credentials</h4>
                <p style={{ color: "#94a3b8", fontSize: "0.825rem" }}>
                  For sandbox and testing environments, use:
                </p>
                <div style={{ marginTop: "6px", background: "rgba(0,0,0,0.4)", padding: "0.6rem 0.8rem", borderRadius: "8px", fontFamily: "monospace", fontSize: "0.8rem", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <div><strong style={{ color: "#fbbf24" }}>Email:</strong> admin@oasispizza.com</div>
                  <div><strong style={{ color: "#fbbf24" }}>Password:</strong> Admin@12345</div>
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: "0.9rem", fontWeight: 700, color: "#fff", marginBottom: "4px" }}>Credential Recovery Protocol</h4>
                <p style={{ color: "#94a3b8", fontSize: "0.825rem" }}>
                  If you have forgotten your administrator credentials or require elevated franchise permissions, please contact corporate IT operations or run the server configuration script.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                handleQuickFill();
                setShowHelpModal(false);
              }}
              style={{
                width: "100%",
                marginTop: "1.5rem",
                padding: "0.75rem",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                border: "none",
                color: "#0c111d",
                fontWeight: 800,
                fontSize: "0.875rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px"
              }}
            >
              <Zap size={15} />
              <span>Fill Demo Credentials & Proceed</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminLogin;
