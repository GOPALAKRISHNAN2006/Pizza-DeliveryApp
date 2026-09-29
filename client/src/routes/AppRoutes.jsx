import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Layouts (can also be lazy or eager, layouts are lightweight shells)
import MainLayout from "../layouts/MainLayout";
import AdminLayout from "../layouts/AdminLayout";

// Guards
import ProtectedRoute from "./ProtectedRoute";
import AdminRoute from "./AdminRoute";

// Page Loader Suspense Fallback
import PageLoader from "../components/PageLoader";

// Lazy-loaded Public & User Pages
const Home = lazy(() => import("../pages/Home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const VerifyEmail = lazy(() => import("../pages/VerifyEmail"));
const ForgotPassword = lazy(() => import("../pages/ForgotPassword"));
const ResetPassword = lazy(() => import("../pages/ResetPassword"));
const PizzaBuilder = lazy(() => import("../pages/PizzaBuilder"));
const OrderSummary = lazy(() => import("../pages/OrderSummary"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const Orders = lazy(() => import("../pages/Orders"));
const OrderDetail = lazy(() => import("../pages/OrderDetail"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Lazy-loaded Admin Pages
const AdminLogin = lazy(() => import("../pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const AdminInventory = lazy(() => import("../pages/admin/AdminInventory"));
const AdminOrders = lazy(() => import("../pages/admin/AdminOrders"));
const AdminOrderDetail = lazy(() => import("../pages/admin/AdminOrderDetail"));

// Route preloader helpers for instant on-hover prefetching
export const preloadRoute = {
  pizzaBuilder: () => import("../pages/PizzaBuilder"),
  login: () => import("../pages/Login"),
  orders: () => import("../pages/Orders"),
  dashboard: () => import("../pages/Dashboard"),
  adminDashboard: () => import("../pages/admin/AdminDashboard")
};

const AppRoutes = () => {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public and Customer Pages wrapped in MainLayout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />

          {/* User Protected Routes */}
          <Route
            path="/pizza-builder"
            element={
              <ProtectedRoute>
                <PizzaBuilder />
              </ProtectedRoute>
            }
          />
          <Route
            path="/order-summary"
            element={
              <ProtectedRoute>
                <OrderSummary />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <Orders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/orders/:id"
            element={
              <ProtectedRoute>
                <OrderDetail />
              </ProtectedRoute>
            }
          />

          {/* 404 Catch-all */}
          <Route path="*" element={<NotFound />} />
        </Route>

        {/* Admin Public Login */}
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Admin Protected Routes wrapped in AdminLayout */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="inventory" element={<AdminInventory />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="orders/:id" element={<AdminOrderDetail />} />
        </Route>
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
