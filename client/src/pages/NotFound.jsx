import React from "react";
import { Link } from "react-router-dom";
import { Pizza, Home } from "lucide-react";

const NotFound = () => {
  return (
    <div style={{ padding: "6rem 0", textAlign: "center" }}>
      <div className="container" style={{ maxWidth: "500px" }}>
        <div className="glass-card" style={{ padding: "3.5rem 2rem" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              borderRadius: "50%",
              background: "rgba(225, 29, 72, 0.15)",
              border: "2px solid var(--primary-500)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem"
            }}
          >
            <Pizza size={42} color="var(--primary-400)" />
          </div>

          <h1 style={{ fontSize: "3.5rem", fontWeight: 900, lineHeight: 1 }} className="gradient-text">
            404
          </h1>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, margin: "0.5rem 0 1rem" }}>
            Slice Not Found!
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "2rem" }}>
            The pizza page you are searching for has already been eaten or does not exist.
          </p>

          <Link to="/" className="btn-primary" style={{ padding: "0.85rem 2rem", display: "inline-flex" }}>
            <Home size={18} />
            <span>Return to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
