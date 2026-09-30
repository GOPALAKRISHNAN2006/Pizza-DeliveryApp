import React from "react";

/**
 * Visual Interactive Artisanal Pizza Canvas that dynamically layers
 * the crust with stone-baked blister textures, rich sauce, molten cheese,
 * and realistic vegetable toppings
 */
const PizzaVisualizer = ({ base, sauce, cheese, vegetables = [] }) => {
  // Determine sauce color styling
  const getSauceStyle = () => {
    if (!sauce) return { opacity: 0.15, background: "rgba(220, 38, 38, 0.4)" };
    const name = sauce.name.toLowerCase();
    if (name.includes("pesto")) {
      return {
        background: "radial-gradient(circle at 45% 45%, #16a34a 0%, #15803d 50%, #14532d 100%)",
        opacity: 0.96
      };
    }
    if (name.includes("garlic") || name.includes("alfredo") || name.includes("white")) {
      return {
        background: "radial-gradient(circle at 45% 45%, #fffbeb 0%, #fef3c7 50%, #fde68a 100%)",
        opacity: 0.95
      };
    }
    if (name.includes("bbq") || name.includes("barbecue")) {
      return {
        background: "radial-gradient(circle at 45% 45%, #78350f 0%, #451a03 60%, #1c0a00 100%)",
        opacity: 0.96
      };
    }
    if (name.includes("peri")) {
      return {
        background: "radial-gradient(circle at 45% 45%, #ea580c 0%, #c2410c 60%, #7c2d12 100%)",
        opacity: 0.96
      };
    }
    // Default marinara
    return {
      background: "radial-gradient(circle at 45% 45%, #ef4444 0%, #dc2626 55%, #991b1b 100%)",
      opacity: 0.96
    };
  };

  // Determine cheese style
  const getCheeseStyle = () => {
    if (!cheese) return { opacity: 0.15, background: "rgba(254, 240, 138, 0.2)" };
    const name = cheese.name.toLowerCase();
    if (name.includes("cheddar")) {
      return {
        background:
          "radial-gradient(circle at 40% 40%, rgba(251, 146, 60, 0.95) 0%, rgba(249, 115, 22, 0.9) 70%, rgba(194, 65, 12, 0.85) 100%)",
        opacity: 0.95
      };
    }
    if (name.includes("gouda")) {
      return {
        background:
          "radial-gradient(circle at 40% 40%, rgba(253, 224, 71, 0.95) 0%, rgba(234, 179, 8, 0.9) 70%, rgba(161, 98, 7, 0.85) 100%)",
        opacity: 0.95
      };
    }
    // Fior di latte / Mozzarella default
    return {
      background:
        "radial-gradient(circle at 40% 40%, rgba(254, 252, 232, 0.96) 0%, rgba(254, 240, 138, 0.92) 65%, rgba(250, 204, 21, 0.85) 100%)",
      opacity: 0.96
    };
  };

  // Realistic Veggie Toppings rendering with individual realistic toppings
  const renderVeggieToppings = () => {
    if (!vegetables || vegetables.length === 0) return null;

    const basePositions = [
      { top: "24%", left: "32%", rot: 15 },
      { top: "28%", left: "62%", rot: -25 },
      { top: "48%", left: "46%", rot: 40 },
      { top: "62%", left: "26%", rot: -10 },
      { top: "65%", left: "62%", rot: 35 },
      { top: "38%", left: "18%", rot: 80 },
      { top: "42%", left: "74%", rot: -60 },
      { top: "18%", left: "48%", rot: 120 },
      { top: "74%", left: "42%", rot: -45 }
    ];

    return vegetables.map((veg, vIdx) => {
      const name = veg.name.toLowerCase();

      // Determine visual topping type
      let type = "pepper";
      if (name.includes("mushroom")) type = "mushroom";
      else if (name.includes("olive")) type = "olive";
      else if (name.includes("jalape")) type = "jalapeno";
      else if (name.includes("onion")) type = "onion";
      else if (name.includes("corn")) type = "corn";
      else if (name.includes("spinach") || name.includes("basil")) type = "leaf";
      else if (name.includes("tomato")) type = "tomato";

      // Select 3 scattered positions for each ingredient
      const activePositions = [
        basePositions[(vIdx * 2) % basePositions.length],
        basePositions[(vIdx * 2 + 1) % basePositions.length],
        basePositions[(vIdx * 2 + 4) % basePositions.length]
      ];

      return activePositions.map((pos, pIdx) => {
        const key = `${veg._id || vIdx}-${pIdx}`;
        return (
          <div
            key={key}
            style={{
              position: "absolute",
              top: pos.top,
              left: pos.left,
              transform: `translate(-50%, -50%) rotate(${pos.rot + pIdx * 40}deg)`,
              filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              zIndex: 20 + vIdx,
              pointerEvents: "none",
              transition: "all 0.3s ease"
            }}
            title={veg.name}
          >
            {type === "mushroom" && (
              <svg width="22" height="20" viewBox="0 0 24 22" fill="none">
                <path d="M12 2C6.5 2 2 6.5 2 12C2 13 3 13.5 4 13.5H20C21 13.5 22 13 22 12C22 6.5 17.5 2 12 2Z" fill="#a8a29e" stroke="#78716c" strokeWidth="1" />
                <path d="M9 13.5V19C9 20 10 21 12 21C14 21 15 20 15 19V13.5" fill="#d6d3d1" stroke="#78716c" strokeWidth="1" />
              </svg>
            )}

            {type === "olive" && (
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="9" fill="#18181b" stroke="#3f3f46" strokeWidth="1.5" />
                <circle cx="10" cy="10" r="4.5" fill="rgba(254, 240, 138, 0.9)" stroke="#27272a" strokeWidth="1" />
              </svg>
            )}

            {type === "jalapeno" && (
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9.5" fill="#15803d" stroke="#14532d" strokeWidth="2" />
                <circle cx="11" cy="11" r="5" fill="rgba(254, 240, 138, 0.85)" stroke="#166534" strokeWidth="1" />
                <circle cx="11" cy="8" r="1" fill="#fef08a" />
                <circle cx="8.5" cy="12" r="1" fill="#fef08a" />
                <circle cx="13.5" cy="12" r="1" fill="#fef08a" />
              </svg>
            )}

            {type === "onion" && (
              <svg width="22" height="18" viewBox="0 0 26 20" fill="none">
                <path d="M3 17C3 7 10 3 23 3" stroke="#a855f7" strokeWidth="3.5" strokeLinecap="round" />
                <path d="M7 17C7 10 12 7 21 7" stroke="#f3e8ff" strokeWidth="2" strokeLinecap="round" />
              </svg>
            )}

            {type === "corn" && (
              <div style={{ display: "flex", gap: "2px" }}>
                <div style={{ width: "9px", height: "9px", borderRadius: "50%", background: "#facc15", border: "1px solid #ca8a04", boxShadow: "inset 0 1px 2px #fef08a" }} />
                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#eab308", border: "1px solid #a16207" }} />
              </div>
            )}

            {type === "leaf" && (
              <svg width="24" height="18" viewBox="0 0 28 20" fill="none">
                <path d="M2 18C4 8 14 2 26 2C24 12 14 18 2 18Z" fill="#16a34a" stroke="#14532d" strokeWidth="1" />
                <path d="M2 18C10 12 18 8 26 2" stroke="#22c55e" strokeWidth="1" strokeLinecap="round" />
              </svg>
            )}

            {type === "tomato" && (
              <svg width="20" height="20" viewBox="0 0 22 22" fill="none">
                <circle cx="11" cy="11" r="9" fill="#ef4444" stroke="#b91c1c" strokeWidth="1.5" />
                <path d="M11 5C9 8 8 11 8 15" stroke="#fca5a5" strokeWidth="1" strokeLinecap="round" />
                <circle cx="8" cy="10" r="1.5" fill="#fef08a" />
                <circle cx="14" cy="10" r="1.5" fill="#fef08a" />
              </svg>
            )}

            {type === "pepper" && (
              <svg width="20" height="12" viewBox="0 0 24 14" fill="none">
                <path d="M2 12C5 3 17 3 22 12" stroke={pIdx % 2 === 0 ? "#22c55e" : "#ef4444"} strokeWidth="3.5" strokeLinecap="round" />
              </svg>
            )}
          </div>
        );
      });
    });
  };

  return (
    <div style={{ textAlign: "center", padding: "1.25rem" }}>
      {/* 3D Realistic Visualizer Box */}
      <div className="pizza-visual-box">
        {/* Layer 1: Stone-Baked Crust Base */}
        <div className="pizza-layer-base">
          {/* Artisanal crust blistering charred spots */}
          <div
            style={{
              position: "absolute",
              top: "6%",
              left: "25%",
              width: "16px",
              height: "8px",
              borderRadius: "50%",
              background: "rgba(69, 26, 3, 0.45)",
              transform: "rotate(-20deg)"
            }}
          />
          <div
            style={{
              position: "absolute",
              bottom: "8%",
              right: "22%",
              width: "18px",
              height: "7px",
              borderRadius: "50%",
              background: "rgba(69, 26, 3, 0.4)",
              transform: "rotate(35deg)"
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "40%",
              right: "4%",
              width: "10px",
              height: "14px",
              borderRadius: "50%",
              background: "rgba(69, 26, 3, 0.35)"
            }}
          />

          {/* Layer 2: Sauce Foundation */}
          <div className="pizza-layer-sauce" style={getSauceStyle()} />

          {/* Layer 3: Melted Bubbling Cheese */}
          <div className="pizza-layer-cheese" style={getCheeseStyle()}>
            {/* Mozzarella brown oven spots */}
            <div
              style={{
                position: "absolute",
                top: "22%",
                right: "28%",
                width: "14px",
                height: "10px",
                borderRadius: "50%",
                background: "rgba(180, 83, 9, 0.45)"
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "26%",
                left: "30%",
                width: "16px",
                height: "9px",
                borderRadius: "50%",
                background: "rgba(180, 83, 9, 0.4)"
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "55%",
                width: "12px",
                height: "8px",
                borderRadius: "50%",
                background: "rgba(180, 83, 9, 0.35)"
              }}
            />

            {/* Layer 4: Vegetable Toppings */}
            {renderVeggieToppings()}
          </div>
        </div>
      </div>

      {/* Dynamic Visual Badges */}
      <div style={{ marginTop: "1.2rem", display: "flex", flexWrap: "wrap", justifyContent: "center", gap: "8px" }}>
        {base && (
          <span className="badge badge-warning" style={{ fontSize: "0.75rem" }}>
            🌾 {base.name}
          </span>
        )}
        {sauce && (
          <span className="badge badge-danger" style={{ fontSize: "0.75rem" }}>
            🍅 {sauce.name}
          </span>
        )}
        {cheese && (
          <span className="badge badge-warning" style={{ fontSize: "0.75rem" }}>
            🧀 {cheese.name}
          </span>
        )}
        {vegetables && vegetables.length > 0 && (
          <span className="badge badge-success" style={{ fontSize: "0.75rem" }}>
            🥗 {vegetables.length} Veggie Topping(s)
          </span>
        )}
      </div>
    </div>
  );
};

export default PizzaVisualizer;
