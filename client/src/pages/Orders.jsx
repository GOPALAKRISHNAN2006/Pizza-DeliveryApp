import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";
import { useSocket } from "../hooks/useSocket";
import { formatCurrency, formatDate, getOrderStatusBadge } from "../utils/formatters";
import { TableRowSkeleton } from "../components/SkeletonLoader";
import { Clock, Search, ArrowRight, Pizza, Layers, Filter } from "lucide-react";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const { latestOrderStatusEvent } = useSocket();

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      if (data.orders) {
        setOrders(data.orders);
        setFilteredOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // Update order when socket event arrives
  useEffect(() => {
    if (latestOrderStatusEvent) {
      setOrders((prev) =>
        prev.map((ord) =>
          ord._id === latestOrderStatusEvent.orderId
            ? { ...ord, orderStatus: latestOrderStatusEvent.orderStatus }
            : ord
        )
      );
    }
  }, [latestOrderStatusEvent]);

  // Filter effect
  useEffect(() => {
    let result = [...orders];

    if (statusFilter !== "All") {
      result = result.filter((o) => o.orderStatus === statusFilter);
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (o) =>
          o._id.toLowerCase().includes(q) ||
          o.items?.some((i) => i.pizzaName?.toLowerCase().includes(q))
      );
    }

    setFilteredOrders(result);
  }, [statusFilter, searchQuery, orders]);

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="container-wide">
        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--primary-400)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
              <Clock size={16} />
              <span>Customer Orders</span>
            </div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: "4px" }}>
              My Pizza <span className="gradient-text">Orders</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              View all your live stone-baked pizza deliveries and past history
            </p>
          </div>

          <Link to="/pizza-builder" className="btn-primary" style={{ padding: "0.85rem 1.75rem" }}>
            <Layers size={18} />
            <span>Order New Pizza</span>
          </Link>
        </div>

        {/* Filters and Search */}
        <div className="glass-card" style={{ padding: "1.25rem", marginBottom: "2rem", display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
            {["All", "Order Received", "In Kitchen", "Sent to Delivery", "Delivered", "Cancelled"].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "8px",
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  border: "none",
                  cursor: "pointer",
                  background: statusFilter === st ? "var(--primary-600)" : "rgba(255,255,255,0.05)",
                  color: statusFilter === st ? "#ffffff" : "#cbd5e1",
                  transition: "all 0.15s"
                }}
              >
                {st}
              </button>
            ))}
          </div>

          <div style={{ position: "relative", minWidth: "240px" }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search by Order ID or Pizza..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: "2.5rem", padding: "0.55rem 1rem 0.55rem 2.5rem", fontSize: "0.875rem" }}
            />
            <Search size={16} color="#64748b" style={{ position: "absolute", left: "0.9rem", top: "50%", transform: "translateY(-50%)" }} />
          </div>
        </div>

        {/* Orders Table */}
        <div className="glass-card" style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#94a3b8" }}>
                <th style={{ padding: "14px 18px" }}>Order ID</th>
                <th style={{ padding: "14px 18px" }}>Date</th>
                <th style={{ padding: "14px 18px" }}>Pizzas & Ingredients</th>
                <th style={{ padding: "14px 18px" }}>Amount</th>
                <th style={{ padding: "14px 18px" }}>Payment</th>
                <th style={{ padding: "14px 18px" }}>Status</th>
                <th style={{ padding: "14px 18px", textAlign: "right" }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <TableRowSkeleton cols={7} />
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ padding: "3rem", textAlign: "center", color: "#94a3b8" }}>
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                    <td style={{ padding: "14px 18px", fontWeight: 800, color: "#fff" }}>
                      #{ord._id.slice(-8).toUpperCase()}
                    </td>
                    <td style={{ padding: "14px 18px", color: "#94a3b8" }}>
                      {formatDate(ord.createdAt)}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <div style={{ fontWeight: 700, color: "#f8fafc" }}>
                        {ord.items?.map((i) => i.pizzaName || "Custom Pizza").join(", ")}
                      </div>
                      <div style={{ fontSize: "0.75rem", color: "#64748b", marginTop: "2px" }}>
                        {ord.items?.map((i) => `${i.baseName || 'Base'}, ${i.sauceName || 'Sauce'}, ${i.cheeseName || 'Cheese'}`).join(" | ")}
                      </div>
                    </td>
                    <td style={{ padding: "14px 18px", fontWeight: 900, color: "var(--primary-400)" }}>
                      {formatCurrency(ord.totalAmount)}
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span className="badge badge-success">Paid</span>
                    </td>
                    <td style={{ padding: "14px 18px" }}>
                      <span className={getOrderStatusBadge(ord.orderStatus)}>
                        {ord.orderStatus}
                      </span>
                    </td>
                    <td style={{ padding: "14px 18px", textAlign: "right" }}>
                      <Link
                        to={`/orders/${ord._id}`}
                        className="btn-secondary"
                        style={{ padding: "0.45rem 0.9rem", fontSize: "0.8rem", display: "inline-flex" }}
                      >
                        <span>Track</span>
                        <ArrowRight size={13} />
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

export default Orders;
