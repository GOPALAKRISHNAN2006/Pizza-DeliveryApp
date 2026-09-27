import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getAdminOrderById, updateAdminOrderStatus } from "../../services/adminService";
import { useSocket } from "../../hooks/useSocket";
import { useToast } from "../../hooks/useToast";
import OrderTracker from "../../components/OrderTracker";
import { Skeleton } from "../../components/SkeletonLoader";
import { formatCurrency, formatDate, getOrderStatusBadge } from "../../utils/formatters";
import {
  ArrowLeft,
  Pizza,
  MapPin,
  CreditCard,
  User,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2
} from "lucide-react";

const AdminOrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { joinOrderRoom, leaveOrderRoom, latestAdminOrderEvent } = useSocket();
  const toast = useToast();

  const fetchOrder = async () => {
    try {
      const res = await getAdminOrderById(id);
      if (res.success) {
        setOrder(res.order);
      }
    } catch (err) {
      console.error("Order fetch failed:", err);
      toast.error(err.message || "Failed to load order");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    joinOrderRoom(id);

    return () => {
      leaveOrderRoom(id);
    };
  }, [id]);

  useEffect(() => {
    if (latestAdminOrderEvent && latestAdminOrderEvent.orderId === id) {
      fetchOrder();
    }
  }, [latestAdminOrderEvent, id]);

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateAdminOrderStatus(id, newStatus);
      if (res.success) {
        toast.success(`Order status updated to: ${newStatus}`);
        setOrder((prev) => ({ ...prev, orderStatus: newStatus }));
      }
    } catch (err) {
      toast.error(err.message || "Failed to update status");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "2rem 0" }}>
        <Skeleton width="30%" height="32px" style={{ marginBottom: "1rem" }} />
        <Skeleton height="150px" borderRadius="16px" style={{ marginBottom: "2rem" }} />
        <Skeleton height="250px" borderRadius="16px" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 800 }}>Order Not Found</h2>
        <Link to="/admin/orders" className="btn-primary" style={{ marginTop: "1rem" }}>
          Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <div>
      {/* Top Header */}
      <div style={{ marginBottom: "2rem" }}>
        <Link
          to="/admin/orders"
          style={{
            color: "#94a3b8",
            fontSize: "0.85rem",
            fontWeight: 600,
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            marginBottom: "1rem"
          }}
        >
          <ArrowLeft size={16} />
          <span>Back to All Orders</span>
        </Link>

        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <h1 style={{ fontSize: "1.85rem", fontWeight: 900 }}>
                Order #{order._id.slice(-8).toUpperCase()}
              </h1>
              <span className={getOrderStatusBadge(order.orderStatus)} style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                {order.orderStatus}
              </span>
            </div>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginTop: "4px" }}>
              Placed on {formatDate(order.createdAt)} • Socket Room: <code>order_{order._id}</code>
            </p>
          </div>

          {/* Quick status dropdown */}
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "0.85rem", color: "#94a3b8", fontWeight: 600 }}>Update Status:</span>
            <select
              value={order.orderStatus}
              onChange={(e) => handleStatusChange(e.target.value)}
              className="form-select"
              style={{
                padding: "0.5rem 1rem",
                fontSize: "0.875rem",
                fontWeight: 700,
                borderRadius: "8px",
                borderColor: "#f59e0b"
              }}
            >
              <option value="Order Received">Order Received</option>
              <option value="In Kitchen">In Kitchen</option>
              <option value="Sent to Delivery">Sent to Delivery</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Real-time tracker preview */}
      <div style={{ marginBottom: "2rem" }}>
        <OrderTracker orderStatus={order.orderStatus} updatedAt={order.updatedAt} />
      </div>

      {/* Grid details */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "1.5rem" }}>
        {/* Left: Pizzas & recipe */}
        <div className="glass-card" style={{ padding: "1.75rem" }}>
          <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
            <Pizza size={20} color="#fbbf24" />
            <span>Pizzas & Ingredients Breakdown</span>
          </h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {order.items?.map((item, idx) => (
              <div
                key={item._id || idx}
                style={{
                  padding: "1rem",
                  background: "rgba(15, 23, 42, 0.6)",
                  border: "1px solid rgba(255, 255, 255, 0.08)",
                  borderRadius: "10px"
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontWeight: 800, color: "#fff" }}>
                    {item.pizzaName} (x{item.quantity || 1})
                  </span>
                  <span style={{ fontWeight: 800, color: "var(--primary-400)" }}>
                    {formatCurrency(item.itemPrice * (item.quantity || 1))}
                  </span>
                </div>

                <div style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div>🌾 <strong>Crust:</strong> {item.base?.name || item.baseName}</div>
                  <div>🍅 <strong>Sauce:</strong> {item.sauce?.name || item.sauceName}</div>
                  <div>🧀 <strong>Cheese:</strong> {item.cheese?.name || item.cheeseName}</div>
                  <div>
                    🥗 <strong>Vegetables:</strong>{" "}
                    {item.vegetables?.length > 0
                      ? item.vegetables.map((v) => v.name || v).join(", ")
                      : item.vegetableNames?.join(", ") || "None"}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "1.5rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontWeight: 800 }}>Total Collected:</span>
            <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "var(--primary-400)" }}>
              {formatCurrency(order.totalAmount)}
            </span>
          </div>
        </div>

        {/* Right: Customer & Delivery Info */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <User size={20} color="#38bdf8" />
              <span>Customer Information</span>
            </h3>

            <div style={{ fontSize: "0.875rem", color: "#cbd5e1", display: "flex", flexDirection: "column", gap: "8px" }}>
              <div style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>
                {order.deliveryAddress?.name || order.user?.name}
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Phone size={14} color="#94a3b8" />
                <span>{order.deliveryAddress?.phone}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <Mail size={14} color="#94a3b8" />
                <span>{order.user?.email || "No email on record"}</span>
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <MapPin size={20} color="var(--accent-orange)" />
              <span>Delivery Address</span>
            </h3>

            <div style={{ fontSize: "0.875rem", color: "#cbd5e1", lineHeight: 1.6 }}>
              <div>{order.deliveryAddress?.street}</div>
              <div>
                {order.deliveryAddress?.city}, {order.deliveryAddress?.state || "India"} - {order.deliveryAddress?.pincode}
              </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <CreditCard size={20} color="#10b981" />
              <span>Razorpay Transaction Data</span>
            </h3>

            <div style={{ fontSize: "0.8rem", color: "#94a3b8", display: "flex", flexDirection: "column", gap: "6px" }}>
              <div>
                Payment ID: <code style={{ color: "#38bdf8" }}>{order.razorpayPaymentId || "N/A"}</code>
              </div>
              <div>
                Razorpay Order: <code style={{ color: "#38bdf8" }}>{order.razorpayOrderId || "N/A"}</code>
              </div>
              <div>Status: <strong style={{ color: "#10b981" }}>{order.paymentStatus}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrderDetail;
