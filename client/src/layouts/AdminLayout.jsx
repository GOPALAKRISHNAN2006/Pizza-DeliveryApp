import React, { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import {
  LayoutDashboard,
  Boxes,
  ShoppingBag,
  LogOut,
  Pizza,
  Home,
  Menu,
  X,
  Shield,
  Bell
} from "lucide-react";

const AdminLayout = () => {
  const { admin, logoutAdmin } = useAuth();
  const { isConnected } = useSocket();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const navItems = [
    { label: "Dashboard", path: "/admin/dashboard", icon: LayoutDashboard },
    { label: "Inventory Stock", path: "/admin/inventory", icon: Boxes },
    { label: "Live Orders", path: "/admin/orders", icon: ShoppingBag }
  ];

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg-dark-950)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "260px",
          background: "var(--bg-dark-900)",
          borderRight: "1px solid rgba(255, 255, 255, 0.08)",
          display: "flex",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 40
        }}
        className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}
      >
        {/* Brand Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid rgba(255, 255, 255, 0.08)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link to="/admin/dashboard" style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                background: "linear-gradient(135deg, #f59e0b, #d97706)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px rgba(245, 158, 11, 0.4)"
              }}
            >
              <Shield size={20} color="#fff" />
            </div>
            <div>
              <div style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>OASIS <span style={{ color: "#fbbf24" }}>ADMIN</span></div>
              <div style={{ fontSize: "0.65rem", color: "#94a3b8", fontWeight: 700, letterSpacing: "1px" }}>MANAGEMENT HUB</div>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            style={{ background: "transparent", border: "none", color: "#fff", cursor: "pointer", display: "none" }}
            className="mobile-close-sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav style={{ padding: "1.5rem 1rem", display: "flex", flexDirection: "column", gap: "0.5rem", flex: 1 }}>
          <div style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", padding: "0 0.5rem 0.5rem" }}>
            Store Controls
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: "0.75rem 1rem",
                  borderRadius: "10px",
                  fontWeight: 600,
                  fontSize: "0.925rem",
                  color: active ? "#ffffff" : "#94a3b8",
                  background: active ? "linear-gradient(135deg, rgba(245, 158, 11, 0.2), rgba(217, 119, 6, 0.1))" : "transparent",
                  border: active ? "1px solid rgba(245, 158, 11, 0.4)" : "1px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                <Icon size={18} color={active ? "#fbbf24" : "#64748b"} />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <div style={{ margin: "1.5rem 0 0.5rem", borderTop: "1px solid rgba(255, 255, 255, 0.06)" }} />

          <Link
            to="/"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "0.75rem 1rem",
              borderRadius: "10px",
              fontWeight: 600,
              fontSize: "0.925rem",
              color: "#cbd5e1",
              transition: "all 0.2s"
            }}
          >
            <Home size={18} color="#94a3b8" />
            <span>Customer Storefront</span>
          </Link>
        </nav>

        {/* Bottom User info & Logout */}
        <div style={{ padding: "1rem", borderTop: "1px solid rgba(255, 255, 255, 0.08)", background: "rgba(0,0,0,0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <div>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#f8fafc" }}>{admin?.name || "Administrator"}</div>
              <div style={{ fontSize: "0.75rem", color: "#fbbf24" }}>{admin?.email}</div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              padding: "0.6rem",
              borderRadius: "8px",
              background: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              color: "#f87171",
              fontSize: "0.85rem",
              fontWeight: 600,
              cursor: "pointer"
            }}
          >
            <LogOut size={16} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Top bar */}
        <header
          style={{
            height: "64px",
            background: "rgba(12, 17, 29, 0.85)",
            backdropFilter: "blur(16px)",
            borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 1.5rem",
            position: "sticky",
            top: 0,
            zIndex: 30
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <button
              onClick={() => setSidebarOpen(true)}
              style={{ background: "transparent", border: "none", color: "#f8fafc", cursor: "pointer", display: "none" }}
              className="mobile-open-sidebar"
            >
              <Menu size={22} />
            </button>
            <div style={{ fontSize: "1rem", fontWeight: 700, color: "#f8fafc" }}>
              Administrator Console
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            {/* Real-time indicator */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                fontSize: "0.75rem",
                fontWeight: 700,
                color: isConnected ? "#34d399" : "#f87171",
                padding: "4px 10px",
                borderRadius: "99px",
                background: isConnected ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)",
                border: `1px solid ${isConnected ? "rgba(16, 185, 129, 0.2)" : "rgba(239, 68, 68, 0.2)"}`
              }}
            >
              <span
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "50%",
                  background: isConnected ? "#10b981" : "#ef4444"
                }}
              />
              <span>{isConnected ? "SOCKET SYNCED" : "OFFLINE"}</span>
            </div>
          </div>
        </header>

        {/* Sub-page Outlet */}
        <div style={{ flex: 1, padding: "2rem 1.5rem" }}>
          <Outlet />
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-sidebar {
            position: fixed !important;
            left: -280px;
            transition: left 0.3s ease;
          }
          .admin-sidebar.open {
            left: 0 !important;
          }
          .mobile-open-sidebar {
            display: block !important;
          }
          .mobile-close-sidebar {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
};

export default AdminLayout;
