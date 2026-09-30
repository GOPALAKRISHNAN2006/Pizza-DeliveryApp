import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useCart } from "../hooks/useCart";
import { useAuth } from "../hooks/useAuth";
import { useToast } from "../hooks/useToast";
import { createPayment, verifyPayment } from "../services/orderService";
import { formatCurrency } from "../utils/formatters";
import {
  ShoppingBag,
  Trash2,
  Plus,
  MapPin,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Pizza,
  Layers,
  Loader2
} from "lucide-react";

const OrderSummary = () => {
  const { cartItems, removeCartItem, clearCart, cartSubtotal } = useCart();
  const { user, isAuthenticated } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const [deliveryAddress, setDeliveryAddress] = useState({
    name: user?.name || "Customer",
    phone: "9876543210",
    street: "Flat 402, Palm View Residency",
    city: "Chennai",
    state: "Tamil Nadu",
    pincode: "600001"
  });

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [pendingRazorpayOrder, setPendingRazorpayOrder] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDeliveryAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      toast.warning("Please sign in to place your pizza order.");
      navigate("/login", { state: { from: { pathname: "/order-summary" } } });
      return;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty. Please craft a pizza first!");
      return;
    }

    if (
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    ) {
      toast.error("Please fill in all delivery address fields.");
      return;
    }

    setPaymentLoading(true);

    try {
      // Step 1: Create Payment Order on Backend (calculates true price from DB)
      const orderPayload = {
        items: cartItems.map((item) => ({
          baseId: item.baseId || item.base?._id || item.base,
          sauceId: item.sauceId || item.sauce?._id || item.sauce,
          cheeseId: item.cheeseId || item.cheese?._id || item.cheese,
          vegetableIds: item.vegetableIds || (item.vegetables || []).map((v) => v._id || v),
          pizzaName: item.pizzaName || "Custom Handcrafted Pizza",
          quantity: item.quantity || 1
        })),
        deliveryAddress
      };

      const res = await createPayment(orderPayload);

      if (!res.success || !res.razorpayOrder) {
        throw new Error(res.message || "Failed to initialize payment.");
      }

      const { razorpayOrder } = res;
      setPendingRazorpayOrder(razorpayOrder);

      // Check if standard window.Razorpay is available in browser and not mock
      if (typeof window.Razorpay === "function" && !razorpayOrder.isMock) {
        const options = {
          key: razorpayOrder.keyId,
          amount: razorpayOrder.amount,
          currency: razorpayOrder.currency,
          name: "Oasis Pizza",
          description: "Artisanal Pizza Order Payment (Test Mode)",
          image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=120&auto=format&fit=crop&q=80",
          order_id: razorpayOrder.id,
          handler: async function (response) {
            await finalizeOrderVerification({
              razorpayOrderId: response.razorpay_order_id || razorpayOrder.id,
              razorpayPaymentId: response.razorpay_payment_id || `pay_${Date.now()}`,
              razorpaySignature: response.razorpay_signature || "test_signature"
            });
          },
          prefill: {
            name: deliveryAddress.name,
            email: user?.email,
            contact: deliveryAddress.phone
          },
          theme: {
            color: "#e11d48"
          }
        };

        const rzp1 = new window.Razorpay(options);
        rzp1.on("payment.failed", function (response) {
          toast.error(`Payment failed: ${response.error?.description || "Gateway error"}`);
          setPaymentLoading(false);
        });
        rzp1.open();
      } else {
        // Test / Mock mode popup for smooth testing
        setShowTestModal(true);
        setPaymentLoading(false);
      }
    } catch (err) {
      console.error("Payment init error:", err);
      toast.error(err.message || "Failed to initiate payment");
      setPaymentLoading(false);
    }
  };

  // Finalize order by sending signature to backend
  const finalizeOrderVerification = async (verificationDetails) => {
    try {
      setPaymentLoading(true);
      const verifyPayload = {
        ...verificationDetails,
        items: cartItems.map((item) => ({
          baseId: item.baseId || item.base?._id || item.base,
          sauceId: item.sauceId || item.sauce?._id || item.sauce,
          cheeseId: item.cheeseId || item.cheese?._id || item.cheese,
          vegetableIds: item.vegetableIds || (item.vegetables || []).map((v) => v._id || v),
          pizzaName: item.pizzaName || "Custom Handcrafted Pizza",
          quantity: item.quantity || 1
        })),
        deliveryAddress
      };

      const res = await verifyPayment(verifyPayload);

      if (res.success && res.order) {
        try {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch (_e) {}

        toast.success("Payment verified! Order placed into kitchen! 🍕");
        clearCart();
        setShowTestModal(false);
        navigate(`/orders/${res.order._id}`);
      } else {
        throw new Error(res.message || "Payment verification failed");
      }
    } catch (err) {
      console.error("Order verification error:", err);
      toast.error(err.message || "Order verification failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleSimulateTestPayment = async () => {
    if (!pendingRazorpayOrder) return;
    const fakePaymentId = `pay_test_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    await finalizeOrderVerification({
      razorpayOrderId: pendingRazorpayOrder.id,
      razorpayPaymentId: fakePaymentId,
      razorpaySignature: "valid_test_signature"
    });
  };

  if (cartItems.length === 0) {
    return (
      <div style={{ padding: "6rem 0", textAlign: "center" }}>
        <div className="container" style={{ maxWidth: "500px" }}>
          <div className="glass-card" style={{ padding: "3rem 2rem" }}>
            <div
              style={{
                width: "72px",
                height: "72px",
                borderRadius: "50%",
                background: "rgba(225, 29, 72, 0.15)",
                border: "2px solid rgba(225, 29, 72, 0.3)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1.5rem"
              }}
            >
              <ShoppingBag size={36} color="var(--primary-400)" />
            </div>
            <h2 style={{ fontSize: "1.75rem", fontWeight: 800, marginBottom: "0.5rem" }}>
              Your Cart is Empty
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem", marginBottom: "2rem" }}>
              You haven't crafted any pizzas yet. Open the interactive builder to create your custom masterpiece!
            </p>
            <Link to="/pizza-builder" className="btn-primary" style={{ padding: "0.85rem 2rem" }}>
              <Layers size={18} />
              <span>Go to Pizza Builder</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="container-wide">
        <div style={{ marginBottom: "2.5rem" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--primary-400)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
            <ShoppingBag size={16} />
            <span>Order Confirmation</span>
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: "4px" }}>
            Review & <span className="gradient-text">Checkout</span>
          </h1>
          <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
            Verify your pizza configuration and delivery details before Razorpay payment.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: "2.5rem",
            alignItems: "start"
          }}
        >
          {/* Left Column: Customized Pizza Items List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "1.5rem" }}>
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.25rem" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>
                  Crafted Pizzas ({cartItems.length})
                </h3>
                <Link to="/pizza-builder" style={{ color: "var(--primary-400)", fontSize: "0.85rem", fontWeight: 700, display: "flex", alignItems: "center", gap: "4px" }}>
                  <Plus size={16} />
                  <span>Build Another Pizza</span>
                </Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
                {cartItems.map((item, index) => (
                  <div
                    key={item.cartItemId || index}
                    style={{
                      padding: "1.25rem",
                      background: "rgba(15, 23, 42, 0.6)",
                      border: "1px solid rgba(255, 255, 255, 0.08)",
                      borderRadius: "12px",
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.75rem"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                        <div style={{ padding: "8px", background: "rgba(225, 29, 72, 0.15)", borderRadius: "8px", color: "var(--primary-400)" }}>
                          <Pizza size={22} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{item.pizzaName}</h4>
                          <div style={{ fontSize: "0.8rem", color: "#94a3b8" }}>
                            Qty: {item.quantity || 1}
                          </div>
                        </div>
                      </div>

                      <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                        <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "#fff" }}>
                          {formatCurrency(item.itemPrice * (item.quantity || 1))}
                        </span>
                        <button
                          onClick={() => removeCartItem(item.cartItemId)}
                          style={{ background: "transparent", border: "none", color: "#f87171", cursor: "pointer", padding: "4px" }}
                          title="Remove item"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>

                    {/* Ingredients Breakdown */}
                    <div style={{ padding: "0.75rem", background: "rgba(0,0,0,0.25)", borderRadius: "8px", fontSize: "0.825rem", color: "#cbd5e1" }}>
                      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "6px" }}>
                        <div>🌾 <strong>Base:</strong> {item.base?.name || "Selected Base"}</div>
                        <div>🍅 <strong>Sauce:</strong> {item.sauce?.name || "Selected Sauce"}</div>
                        <div>🧀 <strong>Cheese:</strong> {item.cheese?.name || "Selected Cheese"}</div>
                        <div>
                          🥗 <strong>Veggies:</strong>{" "}
                          {item.vegetables?.length > 0
                            ? item.vegetables.map((v) => v.name).join(", ")
                            : "None"}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery Address Card */}
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "1.25rem" }}>
                <div style={{ padding: "8px", background: "rgba(249, 115, 22, 0.15)", borderRadius: "8px", color: "var(--accent-orange)" }}>
                  <MapPin size={20} />
                </div>
                <div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Delivery Details</h3>
                  <p style={{ color: "#94a3b8", fontSize: "0.8rem" }}>Where should we deliver your hot pizzas?</p>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    className="form-input"
                    value={deliveryAddress.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Contact Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    className="form-input"
                    value={deliveryAddress.phone}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ gridColumn: "span 2" }}>
                  <label className="form-label">Street Address & Landmark</label>
                  <input
                    type="text"
                    name="street"
                    className="form-input"
                    value={deliveryAddress.street}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    name="city"
                    className="form-input"
                    value={deliveryAddress.city}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    name="pincode"
                    className="form-input"
                    value={deliveryAddress.pincode}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Razorpay Pay CTA */}
          <div style={{ position: "sticky", top: "90px" }}>
            <div className="glass-card" style={{ padding: "1.75rem" }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: 800, marginBottom: "1.25rem" }}>
                Payment Summary
              </h3>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.85rem", fontSize: "0.95rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                  <span>Pizzas Subtotal:</span>
                  <span style={{ color: "#f8fafc", fontWeight: 600 }}>{formatCurrency(cartSubtotal)}</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                  <span>Delivery & Packaging:</span>
                  <span style={{ color: "#10b981", fontWeight: 700 }}>FREE</span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                  <span>GST & Taxes (5%):</span>
                  <span style={{ color: "#f8fafc", fontWeight: 600 }}>Included</span>
                </div>

                <div style={{ margin: "0.5rem 0", borderTop: "1px solid rgba(255,255,255,0.1)" }} />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "1.1rem", fontWeight: 800 }}>Total Payable:</span>
                  <span style={{ fontSize: "1.6rem", fontWeight: 900, color: "var(--primary-400)" }}>
                    {formatCurrency(cartSubtotal)}
                  </span>
                </div>
              </div>

              {/* Razorpay Test Notice */}
              <div
                style={{
                  margin: "1.5rem 0",
                  padding: "0.85rem 1rem",
                  background: "rgba(6, 182, 212, 0.1)",
                  border: "1px solid rgba(6, 182, 212, 0.25)",
                  borderRadius: "10px",
                  fontSize: "0.8rem",
                  color: "#7dd3fc"
                }}
              >
                <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
                  <CreditCard size={16} />
                  <span>Razorpay Test Mode Active</span>
                </div>
                <div>
                  No real money will be charged. Payment is verified securely by the server before deducting stock.
                </div>
              </div>

              <button
                onClick={handleCheckout}
                disabled={paymentLoading}
                className="btn-primary"
                style={{ width: "100%", padding: "1rem", fontSize: "1.05rem" }}
              >
                {paymentLoading ? (
                  <span style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Preparing Payment...</span>
                  </span>
                ) : (
                  <>
                    <span>Pay {formatCurrency(cartSubtotal)} via Razorpay</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <div style={{ marginTop: "1rem", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", color: "#64748b", fontSize: "0.75rem" }}>
                <ShieldCheck size={14} color="#10b981" />
                <span>256-Bit SSL Encrypted & Verified Server Stock</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Razorpay Test Simulation Modal */}
      {showTestModal && pendingRazorpayOrder && (
        <div className="modal-overlay">
          <div className="modal-content" style={{ padding: "2rem", maxWidth: "460px", textAlign: "center" }}>
            <div
              style={{
                width: "56px",
                height: "56px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #0284c7, #0369a1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                margin: "0 auto 1rem",
                boxShadow: "0 0 20px rgba(2, 132, 199, 0.4)"
              }}
            >
              <CreditCard size={28} color="#fff" />
            </div>

            <h3 style={{ fontSize: "1.35rem", fontWeight: 800, marginBottom: "0.25rem" }}>
              Razorpay Test Gateway
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
              Test Mode • Order ID: <code>{pendingRazorpayOrder.id}</code>
            </p>

            <div style={{ padding: "1.25rem", background: "rgba(255,255,255,0.04)", borderRadius: "10px", marginBottom: "1.5rem", textAlign: "left", fontSize: "0.875rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#94a3b8" }}>Customer:</span>
                <span style={{ fontWeight: 600 }}>{deliveryAddress.name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <span style={{ color: "#94a3b8" }}>Amount to Pay:</span>
                <span style={{ fontWeight: 800, color: "#38bdf8", fontSize: "1.1rem" }}>
                  {formatCurrency(pendingRazorpayOrder.amount / 100)}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#94a3b8" }}>Gateway Status:</span>
                <span className="badge badge-success">Ready to Authorize</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button
                onClick={handleSimulateTestPayment}
                disabled={paymentLoading}
                className="btn-primary"
                style={{ width: "100%", padding: "0.85rem", background: "linear-gradient(135deg, #10b981, #059669)" }}
              >
                {paymentLoading ? (
                  <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Verifying & Deducting Stock...</span>
                  </span>
                ) : (
                  "Simulate Successful Test Payment 💳"
                )}
              </button>

              <button
                onClick={() => {
                  setShowTestModal(false);
                  setPaymentLoading(false);
                }}
                disabled={paymentLoading}
                className="btn-secondary"
                style={{ width: "100%", padding: "0.75rem" }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderSummary;
