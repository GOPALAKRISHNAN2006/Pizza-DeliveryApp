import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Skeleton } from "../components/SkeletonLoader";

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 0", display: "flex", flexDirection: "column", gap: "1rem", alignItems: "center" }}>
        <Skeleton width="60%" height="40px" />
        <Skeleton width="80%" height="200px" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
