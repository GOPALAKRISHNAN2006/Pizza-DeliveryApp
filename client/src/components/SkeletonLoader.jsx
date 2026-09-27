import React from "react";

export const Skeleton = ({ width = "100%", height = "20px", borderRadius = "8px", style = {} }) => {
  return (
    <div
      className="skeleton"
      style={{
        width,
        height,
        borderRadius,
        ...style
      }}
    />
  );
};

export const CardSkeleton = () => {
  return (
    <div className="glass-card" style={{ padding: "1.25rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
      <Skeleton height="110px" borderRadius="10px" />
      <Skeleton width="70%" height="22px" />
      <Skeleton width="90%" height="16px" />
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: "auto", paddingTop: "0.5rem" }}>
        <Skeleton width="30%" height="24px" />
        <Skeleton width="40%" height="24px" borderRadius="99px" />
      </div>
    </div>
  );
};

export const TableRowSkeleton = ({ cols = 5 }) => {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} style={{ padding: "14px 16px" }}>
          <Skeleton height="20px" width={i === 0 ? "80%" : "60%"} />
        </td>
      ))}
    </tr>
  );
};

export default {
  Skeleton,
  CardSkeleton,
  TableRowSkeleton
};
