import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { getMyOrders } from "../services/orderService";
import OrderTracker from "../components/OrderTracker";
import { TableRowSkeleton, CardSkeleton } from "../components/SkeletonLoader";
import { formatCurrency, formatDate, getOrderStatusBadge } from "../utils/formatters";
import {
  User,
  Pizza,
  ShoppingBag,
  Clock,
  ArrowRight,
  ShieldCheck,
  Flame,
  CheckCircle2,
  Layers
} from "lucide-react";

const Dashboard = () => {
  const { user } = useAuth();
  const { latestOrderStatusEvent } = useSocket();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const data = await getMyOrders();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to load user orders:", err);
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
            ? { ...ord, orderStatus: latestOrderStatusEvent.orderStatus, updatedAt: latestOrderStatusEvent.updatedAt }
            : ord
        )
      );
    }
  }, [latestOrderStatusEvent]);

  const activeOrders = orders.filter((o) =>
    ["Order Received", "In Kitchen", "Sent to Delivery"].includes(o.orderStatus)
  );

  const pastOrders = orders.filter((o) =>
    ["Delivered", "Cancelled"].includes(o.orderStatus)
  );

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="container-wide">
        {/* User Profile Banner */}
        <div
          className="glass-card"
          style={{
            padding: "2rem",
            marginBottom: "2.5rem",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-between",
            alignItems: "center",
            gap: "1.5rem",
            background: "linear-gradient(135deg, rgba(225, 29, 72, 0.12), rgba(249, 115, 22, 0.08))"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "1.25rem" }}>
            <div
              style={{
                width: "64px",
                height: "64px",
                borderRadius: "50%",
                background: "linear-gradient(135deg, var(--primary-600), var(--accent-orange))",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 20px rgba(225, 29, 72, 0.4)",
                fontSize: "1.75rem",
                fontWeight: 900
              }}
            >
              {user?.name?.[0]?.toUpperCase() || "U"}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800 }}>Welcome, {user?.name}!</h1>
                <span className="badge badge-success">
                  <ShieldCheck size={12} /> Verified Member
                </span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "2px" }}>
                {user?.email} • Member since {formatDate(user?.createdAt || new Date())}
              </p>
            </div>
          </div>

          <Link to="/pizza-builder" className="btn-primary" style={{ padding: "0.85rem 1.75rem" }}>
            <Layers size={18} />
            <span>Craft New Pizza</span>
            <ArrowRight size={16} />
          </Link>
        </div>

        {/* Active Orders Section */}
        <div style={{ marginBottom: "3.5rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.5rem" }}>
            <div style={{ padding: "8px", background: "rgba(225, 29, 72, 0.15)", borderRadius: "8px", color: "var(--primary-400)" }}>
              <Flame size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Active Orders In Progress</h2>
              <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Live socket-synced orders being baked or delivered</p>
            </div>
          </div>

          {loading ? (
            <CardSkeleton />
          ) : activeOrders.length === 0 ? (
            <div className="glass-card" style={{ padding: "2.5rem", textAlign: "center" }}>
              <Pizza size={40} color="#64748b" style={{ margin: "0 auto 0.75rem" }} />
              <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#cbd5e1" }}>No active orders right now</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "4px 0 1.25rem" }}>
                Hungry for fresh stone-baked pizza? Fire up our interactive builder!
              </p>
              <Link to="/pizza-builder" className="btn-primary" style={{ padding: "0.65rem 1.5rem", fontSize: "0.9rem" }}>
                Start Custom Pizza Builder
              </Link>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
              {activeOrders.map((order) => (
                <div key={order._id} className="glass-card" style={{ padding: "1.75rem" }}>
                  <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "#94a3b8" }}>Order ID:</span>
                      <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>
                        #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <div style={{ fontSize: "0.8rem", color: "#64748b" }}>
                        Placed on {formatDate(order.createdAt)}
                      </div>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                      <span className={getOrderStatusBadge(order.orderStatus)} style={{ padding: "6px 14px", fontSize: "0.85rem" }}>
                        {order.orderStatus}
                      </span>
                      <Link to={`/orders/${order._id}`} className="btn-secondary" style={{ padding: "0.6rem 1.2rem", fontSize: "0.85rem" }}>
                        <span>Live Tracking</span>
                        <ArrowRight size={14} />
                      </Link>
                    </div>
                  </div>

                  {/* Real-time Stepper Tracker Component */}
                  <OrderTracker orderStatus={order.orderStatus} updatedAt={order.updatedAt} />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order History Section */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ padding: "8px", background: "rgba(16, 185, 129, 0.15)", borderRadius: "8px", color: "#10b981" }}>
                <Clock size={20} />
              </div>
              <div>
                <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Order History</h2>
                <p style={{ color: "#94a3b8", fontSize: "0.85rem" }}>Past delivered and completed orders</p>
              </div>
            </div>

            <Link to="/orders" style={{ color: "var(--primary-400)", fontSize: "0.875rem", fontWeight: 700 }}>
              View All Orders &rarr;
            </Link>
          </div>

          <div className="glass-card" style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "0.9rem" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.02)", color: "#94a3b8" }}>
                  <th style={{ padding: "14px 18px" }}>Order ID</th>
                  <th style={{ padding: "14px 18px" }}>Date</th>
                  <th style={{ padding: "14px 18px" }}>Pizzas</th>
                  <th style={{ padding: "14px 18px" }}>Amount</th>
                  <th style={{ padding: "14px 18px" }}>Payment</th>
                  <th style={{ padding: "14px 18px" }}>Status</th>
                  <th style={{ padding: "14px 18px", textAlign: "right" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <TableRowSkeleton cols={7} />
                ) : pastOrders.length === 0 ? (
                  <tr>
                    <td colSpan={7} style={{ padding: "2.5rem", textAlign: "center", color: "#94a3b8" }}>
                      No past completed orders yet.
                    </td>
                  </tr>
                ) : (
                  pastOrders.map((ord) => (
                    <tr key={ord._id} style={{ borderBottom: "1px solid rgba(255,255,255,0.04)" }}>
                      <td style={{ padding: "14px 18px", fontWeight: 700, color: "#fff" }}>
                        #{ord._id.slice(-6).toUpperCase()}
                      </td>
                      <td style={{ padding: "14px 18px", color: "#94a3b8" }}>
                        {formatDate(ord.createdAt)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        {ord.items?.map((i) => i.pizzaName || "Custom Pizza").join(", ")}
                      </td>
                      <td style={{ padding: "14px 18px", fontWeight: 800, color: "var(--primary-400)" }}>
                        {formatCurrency(ord.totalAmount)}
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span className="badge badge-success">Paid (Razorpay)</span>
                      </td>
                      <td style={{ padding: "14px 18px" }}>
                        <span className={getOrderStatusBadge(ord.orderStatus)}>
                          {ord.orderStatus}
                        </span>
                      </td>
                      <td style={{ padding: "14px 18px", textAlign: "right" }}>
                        <Link to={`/orders/${ord._id}`} style={{ color: "#38bdf8", fontWeight: 700, fontSize: "0.85rem" }}>
                          View Details
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
    </div>
  );
};

export default Dashboard;
