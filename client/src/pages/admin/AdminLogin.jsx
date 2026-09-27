import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { Shield, Mail, Lock, AlertCircle, ArrowRight, Home } from "lucide-react";

const AdminLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
        background: "radial-gradient(circle at top right, rgba(245, 158, 11, 0.15) 0%, rgba(6, 9, 17, 1) 70%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2rem 1rem"
      }}
    >
      <div style={{ width: "100%", maxWidth: "460px" }}>
        <div className="glass-card" style={{ padding: "2.5rem", border: "1px solid rgba(245, 158, 11, 0.3)" }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2rem" }}>
            <div
              style={{
                width: "60px",
                height: "60px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 0 25px rgba(245, 158, 11, 0.4)"
              }}
            >
              <Shield size={30} color="#fff" />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Admin Portal</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "4px" }}>
              Secure management console for Oasis Pizza operations
            </p>
          </div>

          {/* Error message */}
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

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Admin Email</label>
              <div style={{ position: "relative" }}>
                <input
                  type="email"
                  className="form-input"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  style={{ paddingLeft: "2.75rem" }}
                />
                <Mail size={18} color="#64748b" style={{ position: "absolute", left: "1rem", top: "50%", transform: "translateY(-50%)" }} />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Password</label>
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

            <button
              type="submit"
              disabled={loading}
              className="btn-primary"
              style={{
                width: "100%",
                padding: "0.85rem",
                marginTop: "1rem",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                boxShadow: "0 4px 14px rgba(245, 158, 11, 0.4)"
              }}
            >
              {loading ? "Authenticating..." : "Access Admin Console"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Return link */}
          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <Link to="/" style={{ color: "#94a3b8", fontSize: "0.85rem", display: "inline-flex", alignItems: "center", gap: "6px" }}>
              <Home size={15} />
              <span>Back to Customer Storefront</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
