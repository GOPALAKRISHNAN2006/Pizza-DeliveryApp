import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAdminDashboard, updateAdminOrderStatus } from "../../services/adminService";
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../../hooks/useToast";
import { formatCurrency, formatDate, getOrderStatusBadge } from "../../utils/formatters";
import { CardSkeleton, TableRowSkeleton } from "../../components/SkeletonLoader";
import {
  ShoppingBag,
  IndianRupee,
  Boxes,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  ArrowRight,
  RefreshCw,
  Flame
} from "lucide-react";

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { latestAdminOrderEvent } = useSocket();
  const toast = useToast();

  const fetchDashboardData = async () => {
    try {
      const res = await getAdminDashboard();
      if (res.success) {
        setData(res);
      }
    } catch (err) {
      console.error("Admin dashboard fetch failed:", err);
      toast.error(err.message || "Failed to load dashboard metrics");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Update dashboard data on live socket event
  useEffect(() => {
    if (latestAdminOrderEvent) {
      fetchDashboardData();
    }
  }, [latestAdminOrderEvent]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateAdminOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order updated to: ${newStatus}`);
        fetchDashboardData();
      }
    } catch (err) {
      console.error("Status update error:", err);
      toast.error(err.message || "Failed to update order status");
    }
  };

  const stats = data?.stats || {};
  const recentOrders = data?.recentOrders || [];
  const lowStockItems = data?.lowStockItems || [];

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Operations Overview</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Real-time live monitoring of orders, inventory stock, and revenue
          </p>
        </div>

        <button
          onClick={fetchDashboardData}
          className="btn-secondary"
          style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
        >
          <RefreshCw size={15} />
          <span>Refresh Data</span>
        </button>
      </div>

      {/* Low Stock Warning Banner if any items are low */}
      {lowStockItems.length > 0 && (
        <div
          className="glass-card"
          style={{
            padding: "1.25rem 1.5rem",
            marginBottom: "2rem",
            background: "rgba(245, 158, 11, 0.1)",
            border: "1px solid rgba(245, 158, 11, 0.3)",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1rem"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ padding: "8px", background: "rgba(245, 158, 11, 0.2)", borderRadius: "8px", color: "#fbbf24" }}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div style={{ fontSize: "1rem", fontWeight: 800, color: "#fbbf24" }}>
                Low Stock Alert: {lowStockItems.length} Ingredient(s) Running Low
              </div>
              <div style={{ fontSize: "0.825rem", color: "#cbd5e1" }}>
                Items: {lowStockItems.map((i) => `${i.name} (${i.quantity} left)`).join(", ")}
              </div>
            </div>
          </div>

          <Link
            to="/admin/inventory"
            className="btn-primary"
            style={{
              padding: "0.55rem 1.25rem",
              fontSize: "0.85rem",
              background: "linear-gradient(135deg, #f59e0b, #d97706)"
            }}
          >
            <span>Restock Inventory</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      {/* Metrics Cards Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "1.25rem",
          marginBottom: "2.5rem"
        }}
      >
        {/* Total Revenue */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8" }}>Total Revenue</span>
            <div style={{ padding: "8px", background: "rgba(16, 185, 129, 0.15)", borderRadius: "8px", color: "#10b981" }}>
              <TrendingUp size={20} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>
            {formatCurrency(stats.totalRevenue || 0)}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#10b981", marginTop: "4px" }}>
            From {stats.paidOrders || 0} verified orders
          </div>
        </div>

        {/* Active Orders */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8" }}>Active Orders</span>
            <div style={{ padding: "8px", background: "rgba(225, 29, 72, 0.15)", borderRadius: "8px", color: "var(--primary-400)" }}>
              <Flame size={20} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "var(--primary-400)" }}>
            {stats.pendingOrders || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#94a3b8", marginTop: "4px" }}>
            In kitchen or on the road
          </div>
        </div>

        {/* Total Orders */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8" }}>Total Orders</span>
            <div style={{ padding: "8px", background: "rgba(56, 189, 248, 0.15)", borderRadius: "8px", color: "#38bdf8" }}>
              <ShoppingBag size={20} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>
            {stats.totalOrders || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: "#38bdf8", marginTop: "4px" }}>
            {stats.deliveredOrders || 0} successfully delivered
          </div>
        </div>

        {/* Inventory Overview */}
        <div className="glass-card" style={{ padding: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#94a3b8" }}>Inventory Items</span>
            <div style={{ padding: "8px", background: "rgba(245, 158, 11, 0.15)", borderRadius: "8px", color: "#fbbf24" }}>
              <Boxes size={20} />
            </div>
          </div>
          <div style={{ fontSize: "1.8rem", fontWeight: 900, color: "#fff" }}>
            {stats.totalInventoryItems || 0}
          </div>
          <div style={{ fontSize: "0.75rem", color: stats.lowStockCount > 0 ? "#fbbf24" : "#10b981", marginTop: "4px" }}>
            {stats.lowStockCount || 0} low stock • {stats.outOfStockCount || 0} out of stock
          </div>
        </div>
      </div>

      {/* Recent Orders Management Section */}
      <div className="glass-card" style={{ padding: "1.75rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
          <div>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Recent Customer Orders</h2>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>
              Change order status here to immediately update customer's live tracking
            </p>
          </div>

          <Link to="/admin/orders" style={{ color: "#fbbf24", fontSize: "0.875rem", fontWeight: 700 }}>
            View All Orders &rarr;
          </Link>
        </div>

        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#94a3b8" }}>
                <th style={{ padding: "12px 16px" }}>Order ID</th>
                <th style={{ padding: "12px 16px" }}>Customer</th>
                <th style={{ padding: "12px 16px" }}>Pizzas</th>
                <th style={{ padding: "12px 16px" }}>Amount</th>
                <th style={{ padding: "12px 16px" }}>Payment</th>
                <th style={{ padding: "12px 16px" }}>Status Control</th>
                <th style={{ padding: "12px 16px", textAlign: "right" }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableRowSkeleton cols={7} />
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8" }}>
                    No orders placed yet.
                  </td>
                </tr>
              ) : (
                recentOrders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 800, color: "#fff" }}>
                      #{ord._id.slice(-6).toUpperCase()}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <div style={{ fontWeight: 600, color: "#f8fafc" }}>
                        {ord.user?.name || ord.deliveryAddress?.name || "Customer"}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                        {ord.user?.email}
                      </div>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      {ord.items?.map((i) => i.pizzaName || "Custom Pizza").join(", ")}
                    </td>
                    <td style={{ padding: "12px 16px", fontWeight: 800, color: "var(--primary-400)" }}>
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <span className="badge badge-success">{ord.paymentStatus}</span>
                    </td>
                    <td style={{ padding: "12px 16px" }}>
                      <select
                        value={ord.orderStatus}
                        onChange={(e) => handleStatusChange(ord._id, e.target.value)}
                        className="form-select"
                        style={{
                          padding: "0.4rem 0.6rem",
                          fontSize: "0.8rem",
                          fontWeight: 700,
                          borderRadius: "8px",
                          width: "auto"
                        }}
                      >
                        <option value="Order Received">Order Received</option>
                        <option value="In Kitchen">In Kitchen</option>
                        <option value="Sent to Delivery">Sent to Delivery</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                    <td style={{ padding: "12px 16px", textAlign: "right" }}>
                      <Link
                        to={`/admin/orders/${ord._id}`}
                        style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.8rem" }}
                      >
                        Details &rarr;
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
