import Inventory from "../model/Inventory.js";

/**
 * Get available ingredients for the Custom Pizza Builder
 * GET /api/pizzas/options
 */
export const getPizzaOptions = async (req, res, next) => {
  try {
    // Only return available items where quantity > 0
    const availableIngredients = await Inventory.find({ quantity: { $gt: 0 } })
      .select("_id name price category quantity imageUrl description")
      .sort({ price: 1, name: 1 });

    const bases = availableIngredients.filter((item) => item.category === "base");
    const sauces = availableIngredients.filter((item) => item.category === "sauce");
    const cheeses = availableIngredients.filter((item) => item.category === "cheese");
    const vegetables = availableIngredients.filter((item) => item.category === "vegetable");

    return res.status(200).json({
      success: true,
      bases,
      sauces,
      cheeses,
      vegetables
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get popular chef's signature preset pizzas
 * GET /api/pizzas/presets
 */
export const getPresetPizzas = async (req, res, next) => {
  try {
    const bases = await Inventory.find({ category: "base", quantity: { $gt: 0 } });
    const sauces = await Inventory.find({ category: "sauce", quantity: { $gt: 0 } });
    const cheeses = await Inventory.find({ category: "cheese", quantity: { $gt: 0 } });
    const veggies = await Inventory.find({ category: "vegetable", quantity: { $gt: 0 } });

    // Helper to find item by name or fallback
    const findItem = (list, nameRegex) => list.find((i) => nameRegex.test(i.name)) || list[0];

    const defaultBase = bases[0];
    const defaultSauce = sauces[0];
    const defaultCheese = cheeses[0];

    if (!defaultBase || !defaultSauce || !defaultCheese) {
      return res.status(200).json({
        success: true,
        presets: []
      });
    }

    const presets = [
      {
        id: "preset-margherita",
        name: "Classic Margherita Supreme",
        description: "Artisanal crust layered with vibrant marinara, melted mozzarella, and fresh basil herbs.",
        badge: "Chef's Favorite",
        imageUrl: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&auto=format&fit=crop&q=80",
        base: findItem(bases, /thin|hand|classic/i) || defaultBase,
        sauce: findItem(sauces, /marinara|classic/i) || defaultSauce,
        cheese: findItem(cheeses, /mozzarella/i) || defaultCheese,
        vegetables: veggies.filter((v) => /tomato|basil|spinach/i.test(v.name)).slice(0, 2)
      },
      {
        id: "preset-garden-fresh",
        name: "Garden Harvest Fiesta",
        description: "Loaded with bell peppers, red onions, mushrooms, juicy sweet corn, and rich cheddar cheese.",
        badge: "Vegetarian Delight",
        imageUrl: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
        base: findItem(bases, /hand|pan|crust/i) || defaultBase,
        sauce: findItem(sauces, /marinara|garlic|barbecue/i) || defaultSauce,
        cheese: findItem(cheeses, /cheddar|mozzarella/i) || defaultCheese,
        vegetables: veggies.filter((v) => /pepper|onion|mushroom|corn|olive/i.test(v.name)).slice(0, 4)
      },
      {
        id: "preset-spicy-peri-peri",
        name: "Spicy Peri-Peri Inferno",
        description: "Fiery peri-peri sauce, spicy jalapeños, crisp red onions, bell peppers, and gooey mozzarella.",
        badge: "Extra Spicy 🔥",
        imageUrl: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&auto=format&fit=crop&q=80",
        base: findItem(bases, /burst|thin|hand/i) || defaultBase,
        sauce: findItem(sauces, /peri|spicy/i) || defaultSauce,
        cheese: findItem(cheeses, /mozzarella|parmesan/i) || defaultCheese,
        vegetables: veggies.filter((v) => /jalape|pepper|onion/i.test(v.name)).slice(0, 3)
      },
      {
        id: "preset-four-cheese-deluxe",
        name: "Four Cheese Gourmet Fantasy",
        description: "A decadent harmony of creamy garlic sauce, premium mozzarella, rich parmesan, and olives.",
        badge: "Gourmet Luxury",
        imageUrl: "https://images.unsplash.com/photo-1593560708920-61dd98c46a4e?w=600&auto=format&fit=crop&q=80",
        base: findItem(bases, /burst|crust/i) || defaultBase,
        sauce: findItem(sauces, /garlic|creamy|marinara/i) || defaultSauce,
        cheese: findItem(cheeses, /parmesan|gouda|mozzarella/i) || defaultCheese,
        vegetables: veggies.filter((v) => /olive|mushroom/i.test(v.name)).slice(0, 2)
      }
    ];

    // Compute prices dynamically from ingredient sum
    const calculatedPresets = presets.map((p) => {
      const bPrice = p.base?.price || 0;
      const sPrice = p.sauce?.price || 0;
      const cPrice = p.cheese?.price || 0;
      const vPrice = p.vegetables.reduce((acc, v) => acc + (v.price || 0), 0);
      const totalPrice = bPrice + sPrice + cPrice + vPrice;

      return {
        ...p,
        price: totalPrice
      };
    });

    return res.status(200).json({
      success: true,
      presets: calculatedPresets
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getPizzaOptions,
  getPresetPizzas
};
