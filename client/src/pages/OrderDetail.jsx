import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../services/orderService";
import { useSocket } from "../hooks/useSocket";
import { useToast } from "../hooks/useToast";
import OrderTracker from "../components/OrderTracker";
import { Skeleton } from "../components/SkeletonLoader";
import { formatCurrency, formatDate, getOrderStatusBadge } from "../utils/formatters";
import {
  ArrowLeft,
  Pizza,
  MapPin,
  CreditCard,
  CheckCircle2,
  Clock,
  Phone,
  ShieldCheck,
  RotateCcw
} from "lucide-react";

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const { joinOrderRoom, leaveOrderRoom, latestOrderStatusEvent } = useSocket();
  const toast = useToast();

  const fetchOrderDetails = async () => {
    try {
      const data = await getOrderById(id);
      if (data.order) {
        setOrder(data.order);
      }
    } catch (err) {
      console.error("Failed to load order details:", err);
      toast.error(err.message || "Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderDetails();
    joinOrderRoom(id);

    return () => {
      leaveOrderRoom(id);
    };
  }, [id]);

  // Handle live socket update
  useEffect(() => {
    if (latestOrderStatusEvent && latestOrderStatusEvent.orderId === id) {
      console.log("⚡ Live Socket Order Update in View:", latestOrderStatusEvent);
      setOrder((prev) =>
        prev
          ? {
              ...prev,
              orderStatus: latestOrderStatusEvent.orderStatus,
              updatedAt: latestOrderStatusEvent.updatedAt
            }
          : prev
      );
      toast.success(`Order status updated to: "${latestOrderStatusEvent.orderStatus}"`);
    }
  }, [latestOrderStatusEvent, id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "4rem 0" }}>
        <Skeleton width="40%" height="32px" style={{ marginBottom: "1rem" }} />
        <Skeleton height="160px" borderRadius="16px" style={{ marginBottom: "2rem" }} />
        <Skeleton height="300px" borderRadius="16px" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: "6rem 0", textAlign: "center" }}>
        <div className="glass-card" style={{ padding: "3rem" }}>
          <h2 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Order Not Found</h2>
          <p style={{ color: "#94a3b8", marginBottom: "1.5rem" }}>
            The requested order does not exist or you do not have permission to view it.
          </p>
          <Link to="/orders" className="btn-primary" style={{ padding: "0.75rem 1.5rem" }}>
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="container-wide">
        {/* Top Back Link & Header */}
        <div style={{ marginBottom: "2rem" }}>
          <Link
            to="/orders"
            style={{
              color: "#94a3b8",
              fontSize: "0.875rem",
              fontWeight: 600,
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              marginBottom: "1rem",
              transition: "color 0.2s"
            }}
          >
            <ArrowLeft size={16} />
            <span>Back to My Orders</span>
          </Link>

          <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <h1 style={{ fontSize: "2rem", fontWeight: 900 }}>
                  Order #{order._id.slice(-8).toUpperCase()}
                </h1>
                <span className={getOrderStatusBadge(order.orderStatus)} style={{ padding: "6px 12px", fontSize: "0.85rem" }}>
                  {order.orderStatus}
                </span>
              </div>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "4px" }}>
                Placed on {formatDate(order.createdAt)} • Socket Room: <code>order_{order._id}</code>
              </p>
            </div>

            <button
              onClick={fetchOrderDetails}
              className="btn-secondary"
              style={{ padding: "0.6rem 1.1rem", fontSize: "0.85rem" }}
              title="Refresh order"
            >
              <RotateCcw size={15} />
              <span>Refresh Status</span>
            </button>
          </div>
        </div>

        {/* Real-Time Stepper Progress Tracker */}
        <div style={{ marginBottom: "2.5rem" }}>
          <OrderTracker orderStatus={order.orderStatus} updatedAt={order.updatedAt} />
        </div>

        {/* Order Details Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2rem",
            alignItems: "start"
          }}
        >
          {/* Left Column: Pizzas & Ingredients List */}
          <div className="glass-card" style={{ padding: "1.75rem" }}>
            <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem", display: "flex", alignItems: "center", gap: "8px" }}>
              <Pizza size={20} color="var(--primary-400)" />
              <span>Pizzas Ordered</span>
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              {order.items?.map((item, index) => (
                <div
                  key={item._id || index}
                  style={{
                    padding: "1.25rem",
                    background: "rgba(15, 23, 42, 0.6)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "12px"
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                    <h4 style={{ fontSize: "1.1rem", fontWeight: 800, color: "#fff" }}>
                      {item.pizzaName || "Custom Handcrafted Pizza"}
                    </h4>
                    <span style={{ fontSize: "1.15rem", fontWeight: 800, color: "var(--primary-400)" }}>
                      {formatCurrency(item.itemPrice * (item.quantity || 1))}
                    </span>
                  </div>

                  <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.85rem", color: "#cbd5e1" }}>
                    <div>🌾 <strong>Crust:</strong> {item.base?.name || item.baseName}</div>
                    <div>🍅 <strong>Sauce:</strong> {item.sauce?.name || item.sauceName}</div>
                    <div>🧀 <strong>Cheese:</strong> {item.cheese?.name || item.cheeseName}</div>
                    <div>
                      🥗 <strong>Veggies:</strong>{" "}
                      {item.vegetables?.length > 0
                        ? item.vegetables.map((v) => v.name || v).join(", ")
                        : item.vegetableNames?.join(", ") || "No veggies"}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Subtotal Calculation */}
            <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.9rem", marginBottom: "6px" }}>
                <span>Subtotal:</span>
                <span>{formatCurrency(order.totalAmount)}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8", fontSize: "0.9rem", marginBottom: "6px" }}>
                <span>Delivery:</span>
                <span style={{ color: "#10b981", fontWeight: 700 }}>FREE</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px", paddingTop: "10px", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>Total Paid:</span>
                <span style={{ fontSize: "1.5rem", fontWeight: 900, color: "var(--primary-400)" }}>
                  {formatCurrency(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Delivery & Payment Details */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            {/* Delivery Address */}
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <MapPin size={20} color="var(--accent-orange)" />
                <span>Delivery Address</span>
              </h3>

              <div style={{ fontSize: "0.9rem", color: "#cbd5e1", lineHeight: 1.6 }}>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "1rem" }}>
                  {order.deliveryAddress?.name}
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "#94a3b8", margin: "4px 0" }}>
                  <Phone size={14} />
                  <span>{order.deliveryAddress?.phone}</span>
                </div>
                <div>{order.deliveryAddress?.street}</div>
                <div>
                  {order.deliveryAddress?.city}, {order.deliveryAddress?.state || "India"} - {order.deliveryAddress?.pincode}
                </div>
              </div>
            </div>

            {/* Payment Details */}
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "1rem", display: "flex", alignItems: "center", gap: "8px" }}>
                <CreditCard size={20} color="#38bdf8" />
                <span>Payment Information</span>
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Payment Status:</span>
                  <span className="badge badge-success">
                    <CheckCircle2 size={12} /> {order.paymentStatus}
                  </span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#94a3b8" }}>Gateway:</span>
                  <span style={{ fontWeight: 600 }}>Razorpay (Test Mode)</span>
                </div>
                {order.razorpayPaymentId && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Payment ID:</span>
                    <code style={{ color: "#38bdf8" }}>{order.razorpayPaymentId}</code>
                  </div>
                )}
                {order.razorpayOrderId && (
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <span style={{ color: "#94a3b8" }}>Razorpay Order:</span>
                    <code style={{ color: "#94a3b8" }}>{order.razorpayOrderId}</code>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
