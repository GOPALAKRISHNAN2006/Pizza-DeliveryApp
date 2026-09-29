import React from "react";
import { Check, AlertTriangle, XCircle } from "lucide-react";
import { formatCurrency } from "../utils/formatters";
import OptimizedImage from "./OptimizedImage";

const getCategoryEmoji = (category) => {
  switch (category) {
    case "base":
      return "🌾";
    case "sauce":
      return "🍅";
    case "cheese":
      return "🧀";
    case "veggies":
    case "vegetables":
      return "🥗";
    default:
      return "🍕";
  }
};

const IngredientCard = ({
  item,
  isSelected,
  onSelect,
  isMulti = false
}) => {
  const isOutOfStock = !item.quantity || item.quantity <= 0;
  const isLowStock = item.quantity > 0 && item.quantity <= (item.lowStockThreshold || 10);
  const emoji = getCategoryEmoji(item.category);

  return (
    <div
      onClick={() => {
        if (!isOutOfStock) onSelect(item);
      }}
      className={`glass-card ${isSelected ? "glass-card-selected" : ""} ${
        isOutOfStock ? "opacity-50 cursor-not-allowed" : "glass-card-interactive"
      }`}
      style={{
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "0.75rem",
        position: "relative",
        overflow: "hidden",
        border: isSelected ? "2px solid var(--primary-500)" : "1px solid var(--glass-border)",
        background: isSelected ? "rgba(225, 29, 72, 0.08)" : "var(--glass-bg)",
        opacity: isOutOfStock ? 0.45 : 1,
        pointerEvents: isOutOfStock ? "none" : "auto",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
      }}
    >
      {/* Selection Checkmark / Indicator */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          right: "10px",
          width: "24px",
          height: "24px",
          borderRadius: isMulti ? "6px" : "50%",
          background: isSelected ? "var(--primary-600)" : "rgba(255, 255, 255, 0.08)",
          border: isSelected ? "none" : "1px solid rgba(255, 255, 255, 0.2)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: isSelected ? "0 0 10px rgba(225, 29, 72, 0.5)" : "none",
          transition: "all 0.15s",
          zIndex: 2
        }}
      >
        {isSelected && <Check size={15} color="#ffffff" strokeWidth={3} />}
      </div>

      {/* Item Image with WebP & Lazy Loading */}
      <div style={{ width: "100%", height: "120px", borderRadius: "10px", overflow: "hidden", position: "relative" }}>
        <OptimizedImage
          src={item.imageUrl}
          alt={item.name}
          width={400}
          height={120}
          fallbackEmoji={emoji}
          fallbackText={item.category}
          style={{ width: "100%", height: "120px", objectFit: "cover" }}
          containerStyle={{ width: "100%", height: "120px", borderRadius: "10px" }}
        />
      </div>

      {/* Item Details */}
      <div>
        <h4 style={{ fontSize: "1rem", fontWeight: 700, color: "#f8fafc", marginBottom: "4px" }}>
          {item.name}
        </h4>
        {item.description && (
          <p style={{ fontSize: "0.8rem", color: "#94a3b8", lineHeight: 1.4, marginBottom: "8px" }}>
            {item.description}
          </p>
        )}
      </div>

      {/* Price & Stock Badge Footer */}
      <div style={{ marginTop: "auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ fontSize: "1.05rem", fontWeight: 800, color: "var(--primary-400)" }}>
          +{formatCurrency(item.price)}
        </span>

        {isOutOfStock ? (
          <span className="badge badge-danger">
            <XCircle size={12} /> Out of Stock
          </span>
        ) : isLowStock ? (
          <span className="badge badge-warning" title="Running low!">
            <AlertTriangle size={12} /> Only {item.quantity} left
          </span>
        ) : (
          <span className="badge badge-success" style={{ fontSize: "0.7rem" }}>
            Available
          </span>
        )}
      </div>
    </div>
  );
};

export default IngredientCard;
