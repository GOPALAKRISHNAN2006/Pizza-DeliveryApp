import React from "react";

/**
 * Branded glowing page loader for lazy-loaded route suspense transitions.
 */
const PageLoader = ({ message = "Loading Oasis Pizza..." }) => {
  return (
    <div
      style={{
        minHeight: "70vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "1.5rem",
        padding: "2rem"
      }}
    >
      <div style={{ position: "relative", width: "80px", height: "80px" }}>
        {/* Glowing pulse aura */}
        <div
          style={{
            position: "absolute",
            inset: "-10px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(225, 29, 72, 0.4) 0%, transparent 70%)",
            animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite"
          }}
        />

        {/* Rotating ring spinner */}
        <div
          style={{
            width: "100%",
            height: "100%",
            borderRadius: "50%",
            border: "3px solid rgba(225, 29, 72, 0.15)",
            borderTopColor: "var(--primary-500, #e11d48)",
            borderRightColor: "var(--accent-orange, #f97316)",
            animation: "spin 1s linear infinite"
          }}
        />

        {/* Center Pizza Icon */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "2rem",
            filter: "drop-shadow(0 2px 8px rgba(225, 29, 72, 0.5))",
            animation: "bounce 1.5s infinite"
          }}
        >
          🍕
        </div>
      </div>

      <div style={{ textAlign: "center" }}>
        <p
          style={{
            color: "#f8fafc",
            fontSize: "1rem",
            fontWeight: 600,
            letterSpacing: "0.5px"
          }}
        >
          {message}
        </p>
        <p style={{ color: "#64748b", fontSize: "0.8rem", marginTop: "4px" }}>
          Preparing fresh ingredients...
        </p>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translate(-50%, -50%) scale(1); }
          50% { transform: translate(-50%, -50%) scale(1.15); }
        }
      `}</style>
    </div>
  );
};

export default PageLoader;
