import React, { createContext, useContext, useState, useEffect } from "react";
import { useToast } from "./ToastContext";

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Current active customization in pizza builder
  const [currentPizza, setCurrentPizza] = useState({
    pizzaName: "Custom Handcrafted Pizza",
    base: null,
    sauce: null,
    cheese: null,
    vegetables: [],
    quantity: 1
  });

  // Cart of customized pizzas ready for order
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem("oasis_cart");
    return saved ? JSON.parse(saved) : [];
  });

  const toast = useToast();

  useEffect(() => {
    localStorage.setItem("oasis_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  // Set individual builder choices
  const setBase = (baseItem) => {
    setCurrentPizza((prev) => ({ ...prev, base: baseItem }));
  };

  const setSauce = (sauceItem) => {
    setCurrentPizza((prev) => ({ ...prev, sauce: sauceItem }));
  };

  const setCheese = (cheeseItem) => {
    setCurrentPizza((prev) => ({ ...prev, cheese: cheeseItem }));
  };

  const toggleVegetable = (vegItem) => {
    setCurrentPizza((prev) => {
      const exists = prev.vegetables.some((v) => v._id === vegItem._id);
      if (exists) {
        return {
          ...prev,
          vegetables: prev.vegetables.filter((v) => v._id !== vegItem._id)
        };
      } else {
        return {
          ...prev,
          vegetables: [...prev.vegetables, vegItem]
        };
      }
    });
  };

  // Load a preset into active customizer
  const loadPresetIntoBuilder = (preset) => {
    setCurrentPizza({
      pizzaName: preset.name,
      base: preset.base,
      sauce: preset.sauce,
      cheese: preset.cheese,
      vegetables: preset.vegetables || [],
      quantity: 1
    });
    toast.info(`Loaded "${preset.name}" into Pizza Builder! Customize as you like.`);
  };

  // Reset customizer
  const resetCustomizer = () => {
    setCurrentPizza({
      pizzaName: "Custom Handcrafted Pizza",
      base: null,
      sauce: null,
      cheese: null,
      vegetables: [],
      quantity: 1
    });
  };

  // Calculate current pizza dynamic unit price
  const calculateCurrentPizzaPrice = () => {
    const b = currentPizza.base?.price || 0;
    const s = currentPizza.sauce?.price || 0;
    const c = currentPizza.cheese?.price || 0;
    const v = (currentPizza.vegetables || []).reduce((sum, item) => sum + (item.price || 0), 0);
    return b + s + c + v;
  };

  // Add current customized pizza to cart
  const addCurrentPizzaToCart = () => {
    if (!currentPizza.base) {
      toast.error("Please select a pizza base first.");
      return false;
    }
    if (!currentPizza.sauce) {
      toast.error("Please select a sauce.");
      return false;
    }
    if (!currentPizza.cheese) {
      toast.error("Please select a cheese.");
      return false;
    }

    const itemPrice = calculateCurrentPizzaPrice();
    const newItem = {
      cartItemId: Date.now() + Math.random().toString(36).substring(2, 7),
      pizzaName: currentPizza.pizzaName,
      base: currentPizza.base,
      sauce: currentPizza.sauce,
      cheese: currentPizza.cheese,
      vegetables: currentPizza.vegetables,
      baseId: currentPizza.base._id,
      sauceId: currentPizza.sauce._id,
      cheeseId: currentPizza.cheese._id,
      vegetableIds: currentPizza.vegetables.map((v) => v._id),
      quantity: currentPizza.quantity || 1,
      itemPrice
    };

    setCartItems((prev) => [...prev, newItem]);
    toast.success(`Added "${currentPizza.pizzaName}" to your order summary! 🍕`);
    return true;
  };

  // Remove item from cart
  const removeCartItem = (cartItemId) => {
    setCartItems((prev) => prev.filter((i) => i.cartItemId !== cartItemId));
    toast.info("Removed pizza from cart");
  };

  // Clear cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Calculate total cart price
  const cartSubtotal = cartItems.reduce((acc, item) => acc + item.itemPrice * (item.quantity || 1), 0);

  return (
    <CartContext.Provider
      value={{
        currentPizza,
        setCurrentPizza,
        setBase,
        setSauce,
        setCheese,
        toggleVegetable,
        loadPresetIntoBuilder,
        resetCustomizer,
        calculateCurrentPizzaPrice,
        addCurrentPizzaToCart,
        cartItems,
        removeCartItem,
        clearCart,
        cartSubtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};

export default CartContext;
