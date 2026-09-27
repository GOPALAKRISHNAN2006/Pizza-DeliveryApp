import React from "react";
import { Link } from "react-router-dom";
import { Pizza, Heart, ShieldCheck, Clock, MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer
      style={{
        background: "var(--bg-dark-950)",
        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "4rem 0 2rem 0",
        marginTop: "5rem"
      }}
    >
      <div className="container-wide">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            gap: "3rem",
            marginBottom: "3rem"
          }}
        >
          {/* Brand Info */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1rem" }}>
              <div
                style={{
                  width: "36px",
                  height: "36px",
                  borderRadius: "10px",
                  background: "linear-gradient(135deg, var(--primary-600), var(--accent-orange))",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center"
                }}
              >
                <Pizza size={20} color="#fff" />
              </div>
              <span style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                OASIS <span className="gradient-text">PIZZA</span>
              </span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.9rem", lineHeight: 1.6, marginBottom: "1.2rem" }}>
              Authentic wood-fired stone oven pizzas customized exactly to your palate with real-time tracking from oven to doorstep.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "#34d399", fontSize: "0.85rem", fontWeight: 600 }}>
              <ShieldCheck size={18} />
              <span>100% Contactless & Guaranteed Fresh</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ color: "#f8fafc", fontSize: "1rem", fontWeight: 700, marginBottom: "1.2rem" }}>Quick Navigation</h4>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "#94a3b8" }}>
              <li>
                <Link to="/pizza-builder" style={{ color: "#cbd5e1", transition: "color 0.2s" }}>
                  🍕 Custom Pizza Builder
                </Link>
              </li>
              <li>
                <Link to="/orders" style={{ color: "#cbd5e1", transition: "color 0.2s" }}>
                  📦 Live Order Tracking
                </Link>
              </li>
              <li>
                <Link to="/login" style={{ color: "#cbd5e1", transition: "color 0.2s" }}>
                  👤 Customer Portal
                </Link>
              </li>
              <li>
                <Link to="/register" style={{ color: "#cbd5e1", transition: "color 0.2s" }}>
                  ✨ Join Oasis Rewards
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Service */}
          <div>
            <h4 style={{ color: "#f8fafc", fontSize: "1rem", fontWeight: 700, marginBottom: "1.2rem" }}>Baking Hours</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", color: "#94a3b8", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <Clock size={16} color="var(--primary-400)" style={{ marginTop: "3px" }} />
                <div>
                  <div style={{ color: "#f8fafc", fontWeight: 600 }}>Monday – Sunday</div>
                  <div>11:00 AM – 11:30 PM (Daily)</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                <MapPin size={16} color="var(--accent-orange)" style={{ marginTop: "3px" }} />
                <div>
                  <div style={{ color: "#f8fafc", fontWeight: 600 }}>Central Kitchen & Delivery Hub</div>
                  <div>Oasis Tower, Culinary Boulevard</div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Details */}
          <div>
            <h4 style={{ color: "#f8fafc", fontSize: "1rem", fontWeight: 700, marginBottom: "1.2rem" }}>Direct Support</h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.8rem", color: "#94a3b8", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Phone size={16} color="var(--primary-400)" />
                <span>+91 98765 43210</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Mail size={16} color="var(--accent-orange)" />
                <span>orders@oasispizza.com</span>
              </div>
              <div style={{ marginTop: "0.5rem", padding: "8px 12px", background: "rgba(255,255,255,0.03)", borderRadius: "8px", border: "1px solid rgba(255,255,255,0.08)", fontSize: "0.8rem" }}>
                💳 Supports Razorpay Test UPI, Cards & Netbanking
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div
          style={{
            borderTop: "1px solid rgba(255, 255, 255, 0.06)",
            paddingTop: "1.5rem",
            display: "flex",
            flexWrap: "wrap",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
            fontSize: "0.85rem",
            color: "#64748b"
          }}
        >
          <div>© {new Date().getFullYear()} Oasis Pizza Platform. Crafted with passion.</div>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <span>Built with React, Express, MongoDB & Socket.IO</span>
            <Heart size={14} color="#f43f5e" fill="#f43f5e" />
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
