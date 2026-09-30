import React, { useEffect, useState, useCallback, useMemo } from "react";
import { Link } from "react-router-dom";
import { getAdminOrders, updateAdminOrderStatus } from "../../services/adminService";
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../../hooks/useToast";
import { formatCurrency, formatDate } from "../../utils/formatters";
import { TableRowSkeleton } from "../../components/SkeletonLoader";
import {
  Search,
  RefreshCw,
  Eye
} from "lucide-react";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const { latestAdminOrderEvent } = useSocket();
  const toast = useToast();

  const fetchOrders = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminOrders();
      if (res.success) {
        setOrders(res.orders || []);
      }
    } catch (err) {
      console.error("Admin orders fetch failed:", err);
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // Update on socket event
  useEffect(() => {
    if (latestAdminOrderEvent) {
      fetchOrders();
    }
  }, [latestAdminOrderEvent, fetchOrders]);

  // Filter calculation derived directly via useMemo
  const filtered = useMemo(() => {
    let result = [...orders];

    if (statusFilter !== "All") {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          o.user?.name?.toLowerCase().includes(q) ||
          o.user?.email?.toLowerCase().includes(q) ||
          o.deliveryAddress?.name?.toLowerCase().includes(q) ||
          o.items?.some((i) => i.pizzaName?.toLowerCase().includes(q))
      );
    }

    return result;
  }, [statusFilter, searchQuery, orders]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const res = await updateAdminOrderStatus(orderId, newStatus);
      if (res.success) {
        toast.success(`Order #${orderId.slice(-6).toUpperCase()} status set to: ${newStatus}`);
        setOrders((prev) =>
          prev.map((o) => (o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        );
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  return (
    <div>
      {/* Top Header */}
      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>Customer Orders Management</h1>
          <p style={{ color: "#94a3b8", fontSize: "0.9rem" }}>
            Track order pipeline, advance kitchen workflows, and push real-time customer updates
          </p>
        </div>

        <button onClick={fetchOrders} className="btn-secondary" style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}>
          <RefreshCw size={15} />
          <span>Refresh Orders</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
          {["All", "Order Received", "In Kitchen", "Sent to Delivery", "Delivered", "Cancelled"].map((st) => (
            <button
              key={st}
              onClick={() => setStatusFilter(st)}
              style={{
                padding: "0.45rem 0.9rem",
                borderRadius: "8px",
                fontSize: "0.85rem",
                fontWeight: 600,
                border: "none",
                cursor: "pointer",
                background: statusFilter === st ? "#f59e0b" : "rgba(255,255,255,0.05)",
                color: statusFilter === st ? "#000" : "#cbd5e1",
                transition: "all 0.15s"
              }}
            >
              {st}
            </button>
          ))}
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <input
            type="text"
            className="form-input"
            placeholder="Search by Order ID, customer, pizza..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: "2.5rem", padding: "0.5rem 1rem 0.5rem 2.5rem", fontSize: "0.875rem" }}
          />
          <Search size={16} color="#64748b" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
        </div>
      </div>

      {/* Orders Table */}
      <div className="glass-card" style={{ overflowX: "auto" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.875rem" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#94a3b8" }}>
              <th style={{ padding: "12px 16px" }}>Order ID</th>
              <th style={{ padding: "12px 16px" }}>Customer Details</th>
              <th style={{ padding: "12px 16px" }}>Pizza Items</th>
              <th style={{ padding: "12px 16px" }}>Total</th>
              <th style={{ padding: "12px 16px" }}>Payment</th>
              <th style={{ padding: "12px 16px" }}>Update Order Status (Live Sync)</th>
              <th style={{ padding: "12px 16px", textAlign: "right" }}>Inspect</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <TableRowSkeleton cols={7} />
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                  No orders found.
                </td>
              </tr>
            ) : (
              filtered.map((ord) => (
                <tr key={ord._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                  <td style={{ padding: "12px 16px", fontWeight: 800, color: "#fff" }}>
                    #{ord._id.slice(-8).toUpperCase()}
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>{formatDate(ord.createdAt)}</div>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                      {ord.user?.name || ord.deliveryAddress?.name || "Customer"}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {ord.deliveryAddress?.phone || ord.user?.email}
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px" }}>
                    <div style={{ fontWeight: 600, color: "#cbd5e1" }}>
                      {ord.items?.map((i) => i.pizzaName || "Custom Pizza").join(", ")}
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>
                      {ord.items?.length} item(s) • {ord.deliveryAddress?.city}
                    </div>
                  </td>

                  <td style={{ padding: "12px 16px", fontWeight: 800, color: "var(--primary-400)", fontSize: "1rem" }}>
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
                      style={{
                        padding: "6px 12px",
                        borderRadius: "6px",
                        background: "rgba(56, 189, 248, 0.1)",
                        border: "1px solid rgba(56, 189, 248, 0.3)",
                        color: "#38bdf8",
                        fontWeight: 700,
                        fontSize: "0.8rem",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px"
                      }}
                    >
                      <Eye size={14} />
                      <span>Inspect</span>
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminOrders;
