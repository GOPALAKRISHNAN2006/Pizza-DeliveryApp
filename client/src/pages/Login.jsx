import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [unverifiedEmail, setUnverifiedEmail] = useState(false);

  const { login } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || "/dashboard";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setUnverifiedEmail(false);

    if (!email || !password) {
      setErrorMessage("Please fill in both email and password.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(from, { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      if (err.message && err.message.toLowerCase().includes("verify your email")) {
        setUnverifiedEmail(true);
      }
      setErrorMessage(err.message || "Failed to log in. Please check your credentials.");
      toast.error(err.message || "Login failed");
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
              <LogIn size={26} color="#fff" />
            </div>
            <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Welcome Back</h1>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "4px" }}>
              Sign in to customize pizzas and track your live deliveries
            </p>
          </div>

          {/* Error / Alert Box */}
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
                alignItems: "flex-start",
                gap: "10px"
              }}
            >
              <AlertCircle size={18} style={{ marginTop: "2px", flexShrink: 0 }} />
              <div>
                <div>{errorMessage}</div>
                {unverifiedEmail && (
                  <div style={{ marginTop: "6px" }}>
                    <Link to="/verify-email" style={{ color: "#fb7185", fontWeight: 700, textDecoration: "underline" }}>
                      Go to Email Verification Page &rarr;
                    </Link>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Form */}
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

            <div className="form-group">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <label className="form-label">Password</label>
                <Link to="/forgot-password" style={{ fontSize: "0.8rem", color: "var(--primary-400)", fontWeight: 600 }}>
                  Forgot Password?
                </Link>
              </div>
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
              style={{ width: "100%", padding: "0.85rem", marginTop: "1rem", fontSize: "1rem" }}
            >
              {loading ? "Signing in..." : "Sign In to Account"}
              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          {/* Footer note */}
          <div style={{ marginTop: "2rem", textAlign: "center", fontSize: "0.875rem", color: "#94a3b8" }}>
            Don't have an Oasis Pizza account?{" "}
            <Link to="/register" style={{ color: "var(--primary-400)", fontWeight: 700 }}>
              Create Account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
