import React from "react";
import { CheckCircle2, Clock, Flame, Bike, AlertOctagon } from "lucide-react";
import { ORDER_STEPS, getOrderStatusStepIndex } from "../utils/formatters";

const OrderTracker = ({ orderStatus, updatedAt }) => {
  const isCancelled = orderStatus === "Cancelled";
  const currentStepIdx = getOrderStatusStepIndex(orderStatus);

  if (isCancelled) {
    return (
      <div
        className="glass-card"
        style={{
          padding: "1.5rem",
          background: "rgba(239, 68, 68, 0.08)",
          border: "1px solid rgba(239, 68, 68, 0.25)",
          display: "flex",
          alignItems: "center",
          gap: "1rem"
        }}
      >
        <AlertOctagon size={32} color="#ef4444" />
        <div>
          <h4 style={{ color: "#f87171", fontSize: "1.1rem", fontWeight: 700 }}>Order Cancelled</h4>
          <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
            This order was cancelled. If you have any questions, please contact our support team.
          </p>
        </div>
      </div>
    );
  }

  const getStepIcon = (key, isCompleted, isCurrent) => {
    const size = 20;
    const color = isCompleted || isCurrent ? "#ffffff" : "#64748b";

    switch (key) {
      case "Order Received":
        return <Clock size={size} color={color} />;
      case "In Kitchen":
        return <Flame size={size} color={color} />;
      case "Sent to Delivery":
        return <Bike size={size} color={color} />;
      case "Delivered":
        return <CheckCircle2 size={size} color={color} />;
      default:
        return <Clock size={size} color={color} />;
    }
  };

  return (
    <div className="glass-card" style={{ padding: "1.75rem 1.25rem", position: "relative" }}>
      {/* Live Badge */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span
            style={{
              width: "10px",
              height: "10px",
              borderRadius: "50%",
              background: "#10b981",
              boxShadow: "0 0 10px #10b981",
              animation: "pulse-glow 2s infinite"
            }}
          />
          <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#34d399", letterSpacing: "0.5px" }}>
            REAL-TIME TRACKING ACTIVE
          </span>
        </div>
        <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
          Status: <strong style={{ color: "var(--primary-400)" }}>{orderStatus}</strong>
        </span>
      </div>

      {/* Stepper Steps */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "0.5rem",
          position: "relative"
        }}
      >
        {ORDER_STEPS.map((step, idx) => {
          const isCompleted = idx < currentStepIdx;
          const isCurrent = idx === currentStepIdx;

          return (
            <div
              key={step.key}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                position: "relative",
                zIndex: 2
              }}
            >
              {/* Connector Bar to next step */}
              {idx < ORDER_STEPS.length - 1 && (
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    left: "50%",
                    width: "100%",
                    height: "4px",
                    background: idx < currentStepIdx ? "linear-gradient(90deg, var(--primary-600), #10b981)" : "rgba(255, 255, 255, 0.1)",
                    zIndex: -1,
                    transition: "all 0.4s ease"
                  }}
                />
              )}

              {/* Step Circle Node */}
              <div
                style={{
                  width: "42px",
                  height: "42px",
                  borderRadius: "50%",
                  background: isCurrent
                    ? "linear-gradient(135deg, var(--primary-600), var(--accent-orange))"
                    : isCompleted
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "rgba(255, 255, 255, 0.05)",
                  border: isCurrent
                    ? "2px solid #ffffff"
                    : isCompleted
                    ? "2px solid #10b981"
                    : "1px solid rgba(255, 255, 255, 0.15)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "0.75rem",
                  boxShadow: isCurrent ? "0 0 20px rgba(225, 29, 72, 0.6)" : isCompleted ? "0 0 12px rgba(16, 185, 129, 0.4)" : "none",
                  transition: "all 0.3s ease"
                }}
              >
                {getStepIcon(step.key, isCompleted, isCurrent)}
              </div>

              {/* Label & Description */}
              <div style={{ fontSize: "0.85rem", fontWeight: isCurrent ? 800 : 600, color: isCurrent ? "#ffffff" : isCompleted ? "#cbd5e1" : "#64748b" }}>
                {step.label}
              </div>
              <div style={{ fontSize: "0.7rem", color: isCurrent ? "var(--primary-300)" : "#64748b", marginTop: "4px", display: "none" }} className="step-desc">
                {step.desc}
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        @media (min-width: 640px) {
          .step-desc { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default OrderTracker;
