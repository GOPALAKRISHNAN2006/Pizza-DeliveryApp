import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useCart } from "../hooks/useCart";
import { useSocket } from "../hooks/useSocket";
import { preloadRoute } from "../routes/AppRoutes";
import {
  Pizza,
  ShoppingBag,
  User,
  LogOut,
  Shield,
  Menu,
  X,
  Layers,
  Clock
} from "lucide-react";

const Navbar = () => {
  const { user, isAuthenticated, logoutUser, isAdminAuthenticated } = useAuth();
  const { cartItems } = useCart();
  const { isConnected } = useSocket();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(6, 9, 17, 0.85)",
        backdropFilter: "blur(16px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.08)"
      }}
    >
      <div className="container-wide" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", height: "72px" }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <div
            style={{
              width: "42px",
              height: "42px",
              borderRadius: "12px",
              background: "linear-gradient(135deg, var(--primary-600), var(--accent-orange))",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 20px rgba(225, 29, 72, 0.4)"
            }}
          >
            <Pizza size={24} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: "1.35rem", fontWeight: 900, letterSpacing: "-0.5px", lineHeight: 1 }}>
              OASIS <span className="gradient-text">PIZZA</span>
            </div>
            <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "1.5px", textTransform: "uppercase" }}>
              Artisanal Stone Oven
            </div>
          </div>
        </Link>

        {/* Desktop Nav Links */}
        <nav style={{ display: "none", alignItems: "center", gap: "28px" }} className="desktop-nav">
          <Link
            to="/"
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              color: isActive("/") ? "var(--primary-400)" : "#cbd5e1",
              transition: "color 0.2s"
            }}
          >
            Home
          </Link>
          <Link
            to="/pizza-builder"
            onMouseEnter={() => preloadRoute.pizzaBuilder()}
            style={{
              fontSize: "0.95rem",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: isActive("/pizza-builder") ? "var(--primary-400)" : "#cbd5e1",
              transition: "color 0.2s"
            }}
          >
            <Layers size={16} />
            Pizza Builder
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/orders"
                onMouseEnter={() => preloadRoute.orders()}
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  display: "flex",
                  alignItems: "center",
                  gap: "6px",
                  color: isActive("/orders") ? "var(--primary-400)" : "#cbd5e1",
                  transition: "color 0.2s"
                }}
              >
                <Clock size={16} />
                My Orders
              </Link>
              <Link
                to="/dashboard"
                onMouseEnter={() => preloadRoute.dashboard()}
                style={{
                  fontSize: "0.95rem",
                  fontWeight: 600,
                  color: isActive("/dashboard") ? "var(--primary-400)" : "#cbd5e1",
                  transition: "color 0.2s"
                }}
              >
                Dashboard
              </Link>
            </>
          )}
          {isAdminAuthenticated && (
            <Link
              to="/admin/dashboard"
              onMouseEnter={() => preloadRoute.adminDashboard()}
              style={{
                fontSize: "0.9rem",
                fontWeight: 700,
                color: "#fbbf24",
                display: "flex",
                alignItems: "center",
                gap: "4px",
                padding: "4px 10px",
                borderRadius: "6px",
                background: "rgba(245, 158, 11, 0.1)",
                border: "1px solid rgba(245, 158, 11, 0.3)"
              }}
            >
              <Shield size={14} />
              Admin Portal
            </Link>
          )}
        </nav>

        {/* Right Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          {/* Real-time connection badge */}
          <div
            title={isConnected ? "Real-time Live Socket Connected" : "Connecting to Socket..."}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              padding: "4px 8px",
              borderRadius: "99px",
              background: isConnected ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
              border: `1px solid ${isConnected ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`,
              color: isConnected ? "#34d399" : "#f87171"
            }}
          >
            <span
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: isConnected ? "#10b981" : "#ef4444",
                boxShadow: isConnected ? "0 0 8px #10b981" : "none"
              }}
            />
            <span style={{ fontWeight: 600 }}>{isConnected ? "LIVE" : "CONNECTING"}</span>
          </div>

          {/* Cart Icon */}
          <Link
            to="/order-summary"
            style={{
              position: "relative",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.05)",
              border: "1px solid rgba(255, 255, 255, 0.1)",
              color: "#f8fafc",
              transition: "all 0.2s"
            }}
          >
            <ShoppingBag size={20} />
            {cartItems.length > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-4px",
                  right: "-4px",
                  background: "var(--primary-600)",
                  color: "#fff",
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  width: "20px",
                  height: "20px",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 0 10px rgba(225, 29, 72, 0.6)"
                }}
              >
                {cartItems.length}
              </span>
            )}
          </Link>

          {/* User Auth Buttons */}
          {isAuthenticated ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link
                to="/dashboard"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "10px",
                  background: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(255, 255, 255, 0.1)",
                  fontSize: "0.875rem",
                  fontWeight: 600,
                  color: "#f8fafc"
                }}
              >
                <User size={16} color="var(--primary-400)" />
                <span>{user.name.split(" ")[0]}</span>
              </Link>
              <button
                onClick={() => {
                  logoutUser();
                  navigate("/login");
                }}
                title="Logout"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "38px",
                  height: "38px",
                  borderRadius: "10px",
                  background: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.2)",
                  color: "#f87171",
                  cursor: "pointer"
                }}
              >
                <LogOut size={18} />
              </button>
            </div>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <Link to="/login" className="btn-secondary" style={{ padding: "0.55rem 1.1rem", fontSize: "0.875rem" }}>
                Login
              </Link>
              <Link to="/register" className="btn-primary" style={{ padding: "0.55rem 1.25rem", fontSize: "0.875rem" }}>
                Sign Up
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "40px",
              height: "40px",
              background: "transparent",
              border: "none",
              color: "#f8fafc",
              cursor: "pointer"
            }}
            className="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            background: "var(--bg-dark-900)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
            padding: "1.5rem",
            display: "flex",
            flexDirection: "column",
            gap: "1rem"
          }}
        >
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc" }}
          >
            Home
          </Link>
          <Link
            to="/pizza-builder"
            onClick={() => setMobileMenuOpen(false)}
            style={{ fontSize: "1rem", fontWeight: 600, color: "var(--primary-400)" }}
          >
            🍕 Custom Pizza Builder
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/orders"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc" }}
              >
                📦 My Orders
              </Link>
              <Link
                to="/dashboard"
                onClick={() => setMobileMenuOpen(false)}
                style={{ fontSize: "1rem", fontWeight: 600, color: "#f8fafc" }}
              >
                👤 User Dashboard
              </Link>
            </>
          )}
          {isAdminAuthenticated && (
            <Link
              to="/admin/dashboard"
              onClick={() => setMobileMenuOpen(false)}
              style={{ fontSize: "1rem", fontWeight: 700, color: "#fbbf24" }}
            >
              🛡️ Admin Portal
            </Link>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
      `}</style>
    </header>
  );
};

export default Navbar;
