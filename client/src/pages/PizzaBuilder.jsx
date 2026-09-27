import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../hooks/useCart";
import { useToast } from "../hooks/useToast";
import { getPizzaOptions } from "../services/pizzaService";
import IngredientCard from "../components/IngredientCard";
import PizzaVisualizer from "../components/PizzaVisualizer";
import { CardSkeleton } from "../components/SkeletonLoader";
import { formatCurrency } from "../utils/formatters";
import {
  Layers,
  ChevronRight,
  ChevronLeft,
  ShoppingBag,
  Sparkles,
  Info,
  RotateCcw,
  CheckCircle2
} from "lucide-react";

const STEPS = [
  { step: 1, title: "1. Select Base Crust", category: "bases", desc: "Choose your artisanal stone-baked pizza crust" },
  { step: 2, title: "2. Select Sauce", category: "sauces", desc: "Pick your authentic sauce base" },
  { step: 3, title: "3. Select Cheese", category: "cheeses", desc: "Choose your gourmet melting cheese" },
  { step: 4, title: "4. Select Veggie Toppings", category: "vegetables", desc: "Add fresh garden vegetables (select multiple)" }
];

const PizzaBuilder = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [options, setOptions] = useState({ bases: [], sauces: [], cheeses: [], vegetables: [] });
  const [loading, setLoading] = useState(true);

  const {
    currentPizza,
    setBase,
    setSauce,
    setCheese,
    toggleVegetable,
    calculateCurrentPizzaPrice,
    addCurrentPizzaToCart,
    resetCustomizer
  } = useCart();

  const toast = useToast();
  const navigate = useNavigate();

  // Fetch available MongoDB inventory ingredients
  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const data = await getPizzaOptions();
        if (data.success) {
          setOptions({
            bases: data.bases || [],
            sauces: data.sauces || [],
            cheeses: data.cheeses || [],
            vegetables: data.vegetables || []
          });

          // If no base selected yet, auto-select first available base
          if (!currentPizza.base && data.bases.length > 0) {
            setBase(data.bases[0]);
          }
          if (!currentPizza.sauce && data.sauces.length > 0) {
            setSauce(data.sauces[0]);
          }
          if (!currentPizza.cheese && data.cheeses.length > 0) {
            setCheese(data.cheeses[0]);
          }
        }
      } catch (err) {
        console.error("Failed to load ingredients:", err);
        toast.error("Failed to load inventory ingredients from database");
      } finally {
        setLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  const handleNext = () => {
    if (currentStep === 1 && !currentPizza.base) {
      toast.warning("Please choose a crust base to proceed.");
      return;
    }
    if (currentStep === 2 && !currentPizza.sauce) {
      toast.warning("Please choose a sauce to proceed.");
      return;
    }
    if (currentStep === 3 && !currentPizza.cheese) {
      toast.warning("Please choose a cheese to proceed.");
      return;
    }

    if (currentStep < 4) {
      setCurrentStep((prev) => prev + 1);
    } else {
      // Finalize and add to cart
      const added = addCurrentPizzaToCart();
      if (added) {
        navigate("/order-summary");
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const currentStepConfig = STEPS[currentStep - 1];
  const currentCategoryItems = options[currentStepConfig.category] || [];
  const totalPrice = calculateCurrentPizzaPrice();

  return (
    <div style={{ padding: "3rem 0 5rem" }}>
      <div className="container-wide">
        {/* Top Header */}
        <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "flex-end", gap: "1.5rem", marginBottom: "2.5rem" }}>
          <div>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", color: "var(--primary-400)", fontSize: "0.85rem", fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px" }}>
              <Layers size={16} />
              <span>Interactive Pizza Kitchen</span>
            </div>
            <h1 style={{ fontSize: "2.4rem", fontWeight: 800, marginTop: "4px" }}>
              Custom <span className="gradient-text">Pizza Builder</span>
            </h1>
            <p style={{ color: "#94a3b8", fontSize: "0.95rem" }}>
              Craft your pizza step by step. Every choice updates live from MongoDB inventory.
            </p>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <button
              onClick={resetCustomizer}
              className="btn-secondary"
              style={{ padding: "0.6rem 1rem", fontSize: "0.85rem" }}
              title="Reset builder"
            >
              <RotateCcw size={15} />
              <span>Reset</span>
            </button>

            <div
              className="glass-card"
              style={{
                padding: "0.6rem 1.25rem",
                display: "flex",
                alignItems: "center",
                gap: "10px",
                borderColor: "var(--primary-500)",
                boxShadow: "0 0 15px rgba(225, 29, 72, 0.25)"
              }}
            >
              <span style={{ fontSize: "0.85rem", color: "#94a3b8" }}>Pizza Total:</span>
              <span style={{ fontSize: "1.4rem", fontWeight: 900, color: "#fff" }}>
                {formatCurrency(totalPrice)}
              </span>
            </div>
          </div>
        </div>

        {/* Step Progress Bar */}
        <div
          className="glass-card"
          style={{
            padding: "1rem 1.5rem",
            marginBottom: "2.5rem",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: "1rem"
          }}
        >
          {STEPS.map((s) => {
            const isDone = currentStep > s.step;
            const isCurrent = currentStep === s.step;

            return (
              <div
                key={s.step}
                onClick={() => setCurrentStep(s.step)}
                style={{
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  padding: "0.5rem",
                  borderRadius: "8px",
                  background: isCurrent ? "rgba(225, 29, 72, 0.12)" : "transparent",
                  border: isCurrent ? "1px solid rgba(225, 29, 72, 0.3)" : "1px solid transparent",
                  transition: "all 0.2s"
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    background: isDone
                      ? "#10b981"
                      : isCurrent
                      ? "var(--primary-600)"
                      : "rgba(255,255,255,0.1)",
                    color: "#fff",
                    fontWeight: 800,
                    fontSize: "0.85rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0
                  }}
                >
                  {isDone ? <CheckCircle2 size={16} /> : s.step}
                </div>
                <div style={{ display: "none" }} className="step-label">
                  <div style={{ fontSize: "0.85rem", fontWeight: isCurrent ? 800 : 600, color: isCurrent ? "#fff" : "#94a3b8" }}>
                    {s.title.split(". ")[1]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main Grid: Left Visualizer + Right Ingredients Selector */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            gap: "2.5rem",
            alignItems: "start"
          }}
        >
          {/* Left Column: Visual Canvas & Order Recipe breakdown */}
          <div
            className="glass-card"
            style={{
              padding: "1.75rem",
              position: "sticky",
              top: "90px"
            }}
          >
            <h3 style={{ fontSize: "1.15rem", fontWeight: 800, marginBottom: "0.25rem", textAlign: "center" }}>
              Live Pizza Visualizer
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.8rem", textAlign: "center", marginBottom: "1rem" }}>
              Dynamic preview of your artisanal layers
            </p>

            <PizzaVisualizer
              base={currentPizza.base}
              sauce={currentPizza.sauce}
              cheese={currentPizza.cheese}
              vegetables={currentPizza.vegetables}
            />

            {/* Selection Breakdown */}
            <div style={{ marginTop: "1.5rem", borderTop: "1px solid rgba(255,255,255,0.08)", paddingTop: "1.25rem" }}>
              <div style={{ fontSize: "0.85rem", fontWeight: 700, color: "#cbd5e1", marginBottom: "0.75rem" }}>
                Current Recipe Breakdown:
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "0.6rem", fontSize: "0.85rem" }}>
                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                  <span>Crust Base:</span>
                  <span style={{ color: "#f8fafc", fontWeight: 600 }}>
                    {currentPizza.base ? `${currentPizza.base.name} (${formatCurrency(currentPizza.base.price)})` : "Not selected"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                  <span>Sauce:</span>
                  <span style={{ color: "#f8fafc", fontWeight: 600 }}>
                    {currentPizza.sauce ? `${currentPizza.sauce.name} (${formatCurrency(currentPizza.sauce.price)})` : "Not selected"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                  <span>Cheese:</span>
                  <span style={{ color: "#f8fafc", fontWeight: 600 }}>
                    {currentPizza.cheese ? `${currentPizza.cheese.name} (${formatCurrency(currentPizza.cheese.price)})` : "Not selected"}
                  </span>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", color: "#94a3b8" }}>
                  <span>Vegetables:</span>
                  <span style={{ color: "#f8fafc", fontWeight: 600, textAlign: "right" }}>
                    {currentPizza.vegetables?.length > 0
                      ? currentPizza.vegetables.map((v) => v.name).join(", ")
                      : "No veggies selected (optional)"}
                  </span>
                </div>
              </div>

              <div style={{ marginTop: "1.25rem", paddingTop: "1rem", borderTop: "1px solid rgba(255,255,255,0.08)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 800, fontSize: "1rem" }}>Single Pizza Price:</span>
                <span style={{ fontWeight: 900, fontSize: "1.35rem", color: "var(--primary-400)" }}>
                  {formatCurrency(totalPrice)}
                </span>
              </div>
            </div>
          </div>

          {/* Right Column: Step Ingredient Choices */}
          <div>
            {/* Step Banner */}
            <div className="glass-card" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "#fff" }}>
                    {currentStepConfig.title}
                  </h2>
                  <p style={{ color: "#94a3b8", fontSize: "0.875rem", marginTop: "4px" }}>
                    {currentStepConfig.desc}
                  </p>
                </div>
                <span className="badge badge-primary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>
                  Step {currentStep} of 4
                </span>
              </div>
            </div>

            {/* Ingredients Grid */}
            {loading ? (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                {[...Array(4)].map((_, i) => (
                  <CardSkeleton key={i} />
                ))}
              </div>
            ) : currentCategoryItems.length === 0 ? (
              <div className="glass-card" style={{ padding: "3rem", textAlign: "center" }}>
                <Info size={36} color="#fbbf24" style={{ margin: "0 auto 1rem" }} />
                <h3 style={{ fontSize: "1.2rem", fontWeight: 700 }}>No ingredients currently in stock</h3>
                <p style={{ color: "#94a3b8", fontSize: "0.9rem", marginTop: "0.5rem" }}>
                  All items for this category are out of stock. Please check with the administrator.
                </p>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "1.25rem" }}>
                {currentCategoryItems.map((item) => {
                  let isSelected = false;

                  if (currentStep === 1) isSelected = currentPizza.base?._id === item._id;
                  if (currentStep === 2) isSelected = currentPizza.sauce?._id === item._id;
                  if (currentStep === 3) isSelected = currentPizza.cheese?._id === item._id;
                  if (currentStep === 4) isSelected = currentPizza.vegetables?.some((v) => v._id === item._id);

                  return (
                    <IngredientCard
                      key={item._id}
                      item={item}
                      isSelected={isSelected}
                      isMulti={currentStep === 4}
                      onSelect={(selectedItem) => {
                        if (currentStep === 1) setBase(selectedItem);
                        if (currentStep === 2) setSauce(selectedItem);
                        if (currentStep === 3) setCheese(selectedItem);
                        if (currentStep === 4) toggleVegetable(selectedItem);
                      }}
                    />
                  );
                })}
              </div>
            )}

            {/* Step Navigation Controls */}
            <div
              style={{
                marginTop: "2.5rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: "1rem"
              }}
            >
              <button
                onClick={handlePrev}
                disabled={currentStep === 1}
                className="btn-secondary"
                style={{ padding: "0.85rem 1.75rem" }}
              >
                <ChevronLeft size={18} />
                <span>Back</span>
              </button>

              <button
                onClick={handleNext}
                className="btn-primary"
                style={{ padding: "0.85rem 2rem", fontSize: "1rem" }}
              >
                <span>{currentStep === 4 ? "Add to Order Summary & Checkout" : "Continue to Next Step"}</span>
                {currentStep === 4 ? <ShoppingBag size={18} /> : <ChevronRight size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (min-width: 768px) {
          .step-label { display: block !important; }
        }
      `}</style>
    </div>
  );
};

export default PizzaBuilder;
