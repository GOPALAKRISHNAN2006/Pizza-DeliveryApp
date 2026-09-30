import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { getPresetPizzas } from "../services/pizzaService";
import { formatCurrency } from "../utils/formatters";
import OptimizedImage from "../components/OptimizedImage";
import { CardSkeleton } from "../components/SkeletonLoader";
import { preloadRoute } from "../routes/AppRoutes";
import {
  Sparkles,
  Flame,
  Clock,
  ArrowRight,
  Star,
  Award,
  Layers
} from "lucide-react";

const Home = () => {
  const [presets, setPresets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { loadPresetIntoBuilder } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPresets = async () => {
      try {
        const data = await getPresetPizzas();
        if (data.presets) {
          setPresets(data.presets);
        }
      } catch (err) {
        console.error("Failed to load preset pizzas:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPresets();
  }, []);

  const handleCustomizePreset = (preset) => {
    loadPresetIntoBuilder(preset);
    navigate("/pizza-builder");
  };

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          position: "relative",
          padding: "5rem 0 6rem",
          overflow: "hidden",
          background: "radial-gradient(circle at top center, rgba(225, 29, 72, 0.15) 0%, rgba(6, 9, 17, 1) 70%)"
        }}
      >
        <div className="container-wide">
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "3.5rem",
              alignItems: "center"
            }}
          >
            {/* Left Content */}
            <div>
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 14px",
                  borderRadius: "99px",
                  background: "rgba(225, 29, 72, 0.15)",
                  border: "1px solid rgba(225, 29, 72, 0.3)",
                  color: "#fb7185",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  marginBottom: "1.5rem"
                }}
              >
                <Sparkles size={16} />
                <span>Wood-Fired Artisanal Pizza Platform</span>
              </div>

              <h1
                style={{
                  fontSize: "clamp(2.5rem, 5vw, 4rem)",
                  fontWeight: 900,
                  lineHeight: 1.1,
                  marginBottom: "1.5rem",
                  letterSpacing: "-0.03em"
                }}
              >
                Craft Your Dream Pizza. <br />
                <span className="gradient-text">Track In Real-Time.</span>
              </h1>

              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#94a3b8",
                  lineHeight: 1.7,
                  marginBottom: "2.5rem",
                  maxWidth: "540px"
                }}
              >
                Choose from fresh crusts, rich sauces, premium cheeses, and crisp garden toppings. Powered by live MongoDB inventory and automated Razorpay checkout.
              </p>

              <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", alignItems: "center" }}>
                <Link
                  to="/pizza-builder"
                  onMouseEnter={() => preloadRoute.pizzaBuilder()}
                  className="btn-primary"
                  style={{ padding: "0.9rem 2rem", fontSize: "1.05rem" }}
                >
                  <Layers size={20} />
                  <span>Build Custom Pizza</span>
                  <ArrowRight size={18} />
                </Link>

                <a
                  href="#presets"
                  className="btn-secondary"
                  style={{ padding: "0.9rem 1.8rem", fontSize: "1.05rem" }}
                >
                  Explore Signature Menu
                </a>
              </div>

              {/* Badges row */}
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "1.5rem",
                  marginTop: "3rem",
                  paddingTop: "2rem",
                  borderTop: "1px solid rgba(255, 255, 255, 0.08)"
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ padding: "8px", background: "rgba(249, 115, 22, 0.15)", borderRadius: "8px", color: "#f97316" }}>
                    <Flame size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>450°C Stone Oven</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Authentic wood-fired taste</div>
                  </div>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <div style={{ padding: "8px", background: "rgba(16, 185, 129, 0.15)", borderRadius: "8px", color: "#10b981" }}>
                    <Clock size={20} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "0.95rem" }}>30 Min Delivery</div>
                    <div style={{ fontSize: "0.75rem", color: "#64748b" }}>Live socket-synced tracker</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Visual Floating Showcase */}
            <div style={{ position: "relative", display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  maxWidth: "460px"
                }}
              >
                {/* Glowing Backdrop */}
                <div
                  style={{
                    position: "absolute",
                    inset: "0",
                    background: "radial-gradient(circle, rgba(225, 29, 72, 0.35) 0%, transparent 70%)",
                    filter: "blur(40px)",
                    zIndex: 0
                  }}
                />

                {/* Hero Pizza Card */}
                <div
                  className="glass-card animate-float"
                  style={{
                    position: "relative",
                    zIndex: 1,
                    padding: "1.5rem",
                    overflow: "hidden"
                  }}
                >
                  <div style={{ height: "300px", borderRadius: "14px", overflow: "hidden", position: "relative" }}>
                    <OptimizedImage
                      src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&auto=format&fit=crop&q=80"
                      alt="Artisanal Pizza"
                      width={800}
                      height={300}
                      priority={true}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      containerStyle={{ width: "100%", height: "300px", borderRadius: "14px" }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        top: "14px",
                        left: "14px",
                        background: "rgba(0, 0, 0, 0.75)",
                        backdropFilter: "blur(8px)",
                        padding: "6px 12px",
                        borderRadius: "99px",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#fbbf24",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        zIndex: 2
                      }}
                    >
                      <Award size={14} />
                      <span>Signature Stone-Baked</span>
                    </div>
                  </div>

                  <div style={{ marginTop: "1.25rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <h3 style={{ fontSize: "1.25rem", fontWeight: 800 }}>Custom Handcrafted Masterpiece</h3>
                      <span style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--primary-400)" }}>₹399</span>
                    </div>
                    <p style={{ color: "#94a3b8", fontSize: "0.875rem", margin: "6px 0 16px" }}>
                      Thin Italian crust, rich San Marzano marinara, creamy fresh mozzarella, mushrooms, olives & fresh basil.
                    </p>

                    <Link
                      to="/pizza-builder"
                      onMouseEnter={() => preloadRoute.pizzaBuilder()}
                      className="btn-primary"
                      style={{ width: "100%" }}
                    >
                      Customize Yours Now
                    </Link>
                  </div>
                </div>

                {/* Floating Rating Pill */}
                <div
                  className="glass-card"
                  style={{
                    position: "absolute",
                    bottom: "-20px",
                    left: "-20px",
                    padding: "10px 16px",
                    display: "flex",
                    alignItems: "center",
                    gap: "10px",
                    zIndex: 2,
                    boxShadow: "0 10px 25px rgba(0,0,0,0.5)"
                  }}
                >
                  <div style={{ display: "flex", gap: "2px", color: "#fbbf24" }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#fbbf24" />
                    ))}
                  </div>
                  <div>
                    <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>4.9 / 5.0 Rating</div>
                    <div style={{ fontSize: "0.7rem", color: "#94a3b8" }}>15,000+ happy pizza lovers</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Signature Chef Presets */}
      <section id="presets" style={{ padding: "5rem 0" }}>
        <div className="container-wide">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 3.5rem" }}>
            <span
              style={{
                fontSize: "0.85rem",
                fontWeight: 700,
                color: "var(--primary-400)",
                textTransform: "uppercase",
                letterSpacing: "1.5px"
              }}
            >
              CHEF'S CURATED SELECTION
            </span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginTop: "0.5rem" }}>
              Signature <span className="gradient-text">Recipes</span>
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "1rem", marginTop: "0.75rem" }}>
              Pre-designed award-winning ingredient combinations. Order as-is or open in the Custom Pizza Builder to tweak toppings!
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "2rem"
            }}
          >
            {loading ? (
              <CardSkeleton count={3} />
            ) : (
              presets.map((preset) => (
              <div
                key={preset.id}
                className="glass-card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  overflow: "hidden",
                  transition: "transform 0.3s ease"
                }}
              >
                <div style={{ height: "190px", position: "relative", overflow: "hidden" }}>
                  <OptimizedImage
                    src={preset.imageUrl}
                    alt={preset.name}
                    width={500}
                    height={190}
                    style={{ width: "100%", height: "100%", objectFit: "cover", transition: "transform 0.4s ease" }}
                    containerStyle={{ width: "100%", height: "190px" }}
                  />
                  {preset.badge && (
                    <span
                      style={{
                        position: "absolute",
                        top: "12px",
                        left: "12px",
                        background: "rgba(0,0,0,0.8)",
                        backdropFilter: "blur(6px)",
                        color: "#fbbf24",
                        fontSize: "0.75rem",
                        fontWeight: 700,
                        padding: "4px 10px",
                        borderRadius: "99px",
                        border: "1px solid rgba(251, 191, 36, 0.3)",
                        zIndex: 2
                      }}
                    >
                      {preset.badge}
                    </span>
                  )}
                </div>

                <div style={{ padding: "1.5rem", display: "flex", flexDirection: "column", flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "8px" }}>
                    <h3 style={{ fontSize: "1.15rem", fontWeight: 800 }}>{preset.name}</h3>
                    <span style={{ fontSize: "1.25rem", fontWeight: 800, color: "var(--primary-400)" }}>
                      {formatCurrency(preset.price)}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.85rem", color: "#94a3b8", lineHeight: 1.5, marginBottom: "1.25rem" }}>
                    {preset.description}
                  </p>

                  {/* Ingredient pills */}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginBottom: "1.5rem" }}>
                    <span className="badge badge-warning" style={{ fontSize: "0.7rem" }}>
                      {preset.base?.name}
                    </span>
                    <span className="badge badge-danger" style={{ fontSize: "0.7rem" }}>
                      {preset.sauce?.name}
                    </span>
                    <span className="badge badge-warning" style={{ fontSize: "0.7rem" }}>
                      {preset.cheese?.name}
                    </span>
                    {preset.vegetables?.map((v) => (
                      <span key={v._id} className="badge badge-success" style={{ fontSize: "0.7rem" }}>
                        {v.name}
                      </span>
                    ))}
                  </div>

                  <div style={{ marginTop: "auto" }}>
                    <button
                      onClick={() => handleCustomizePreset(preset)}
                      onMouseEnter={() => preloadRoute.pizzaBuilder()}
                      className="btn-primary"
                      style={{ width: "100%", padding: "0.75rem" }}
                    >
                      Customize in Builder
                    </button>
                  </div>
                </div>
              </div>
            )))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section style={{ padding: "5rem 0", background: "rgba(12, 17, 29, 0.6)", borderTop: "1px solid rgba(255, 255, 255, 0.06)", borderBottom: "1px solid rgba(255, 255, 255, 0.06)" }}>
        <div className="container-wide">
          <div style={{ textAlign: "center", maxWidth: "600px", margin: "0 auto 4rem" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--accent-orange)", textTransform: "uppercase", letterSpacing: "1.5px" }}>
              STEP-BY-STEP PROCESS
            </span>
            <h2 style={{ fontSize: "2.5rem", fontWeight: 800, marginTop: "0.5rem" }}>
              How Oasis Pizza Works
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "2rem" }}>
            <div className="glass-card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", margin: "0 auto 1.25rem", borderRadius: "16px", background: "rgba(225, 29, 72, 0.15)", border: "1px solid rgba(225, 29, 72, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem" }}>
                🍕
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>1. Build Your Pizza</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                Select your favorite crust, sauce, cheeses, and farm-fresh vegetable toppings in our interactive multi-step customizer.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", margin: "0 auto 1.25rem", borderRadius: "16px", background: "rgba(245, 158, 11, 0.15)", border: "1px solid rgba(245, 158, 11, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem" }}>
                💳
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>2. Test Razorpay Pay</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                Checkout safely using Razorpay test integration. Prices are verified securely by our backend MongoDB inventory.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", margin: "0 auto 1.25rem", borderRadius: "16px", background: "rgba(16, 185, 129, 0.15)", border: "1px solid rgba(16, 185, 129, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem" }}>
                🔥
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>3. Wood-Fired Baking</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                Our artisanal pizzaiolos bake your customized pizza in our hot stone ovens within 8 minutes.
              </p>
            </div>

            <div className="glass-card" style={{ padding: "2rem 1.5rem", textAlign: "center" }}>
              <div style={{ width: "60px", height: "60px", margin: "0 auto 1.25rem", borderRadius: "16px", background: "rgba(6, 182, 212, 0.15)", border: "1px solid rgba(6, 182, 212, 0.3)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.75rem" }}>
                🚀
              </div>
              <h3 style={{ fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>4. Real-Time Tracking</h3>
              <p style={{ color: "#94a3b8", fontSize: "0.875rem" }}>
                Track every stage from Kitchen to Delivery in real-time over WebSockets without manual browser refreshes.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
