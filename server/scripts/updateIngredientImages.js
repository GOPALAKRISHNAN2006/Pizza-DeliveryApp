import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "../config/db.js";
import Inventory from "../model/Inventory.js";

dotenv.config();

/**
 * Curated accurate, real pictures for each specific ingredient
 */
export const accurateIngredients = [
  // ==================== BASES (PIZZA CRUSTS & DOUGH) ====================
  {
    name: "Classic Hand-Tossed Crust",
    category: "base",
    quantity: 50,
    lowStockThreshold: 10,
    price: 120,
    description: "Traditional golden-brown crust, crisp on the outside, tender inside.",
    imageUrl: "/images/ingredients/classic_crust.jpg"
  },
  {
    name: "Crispy Thin Crust",
    category: "base",
    quantity: 45,
    lowStockThreshold: 10,
    price: 110,
    description: "Ultra-light, cracker-crisp artisanal Italian thin crust.",
    imageUrl: "/images/ingredients/thin_crust.jpg"
  },
  {
    name: "Molten Cheese Burst Crust",
    category: "base",
    quantity: 35,
    lowStockThreshold: 8,
    price: 180,
    description: "Stuffed crust overflowing with hot, creamy melted cheese.",
    imageUrl: "/images/ingredients/cheese_burst_crust.jpg"
  },
  {
    name: "Golden Pan Crust",
    category: "base",
    quantity: 40,
    lowStockThreshold: 10,
    price: 140,
    description: "Thick, buttery, deep-dish crust with crispy caramelized edges.",
    imageUrl: "/images/ingredients/pan_crust.jpg"
  },
  {
    name: "Gluten-Free Cauliflower Crust",
    category: "base",
    quantity: 25,
    lowStockThreshold: 5,
    price: 190,
    description: "Healthy and naturally gluten-free gourmet crust.",
    imageUrl: "/images/ingredients/cauliflower_crust.jpg"
  },

  // ==================== SAUCES ====================
  {
    name: "Authentic San Marzano Marinara",
    category: "sauce",
    quantity: 60,
    lowStockThreshold: 15,
    price: 45,
    description: "Rich Italian vine-ripened tomato sauce infused with oregano and garlic.",
    imageUrl: "/images/ingredients/marinara_sauce.jpg"
  },
  {
    name: "Creamy Garlic Alfredo",
    category: "sauce",
    quantity: 40,
    lowStockThreshold: 10,
    price: 60,
    description: "Velvety white sauce made with butter, heavy cream, and roasted garlic.",
    imageUrl: "/images/ingredients/alfredo_sauce.jpg"
  },
  {
    name: "Smoky Texas BBQ",
    category: "sauce",
    quantity: 35,
    lowStockThreshold: 10,
    price: 55,
    description: "Sweet, tangy, and deeply smoked barbecue sauce.",
    imageUrl: "/images/ingredients/bbq_sauce.jpg"
  },
  {
    name: "Spicy Peri-Peri Chilli Sauce",
    category: "sauce",
    quantity: 30,
    lowStockThreshold: 8,
    price: 50,
    description: "Zesty bird's eye chili blend delivering an authentic fiery punch.",
    imageUrl: "/images/ingredients/peri_peri_sauce.jpg"
  },
  {
    name: "Fresh Basil Pesto Genovese",
    category: "sauce",
    quantity: 25,
    lowStockThreshold: 6,
    price: 70,
    description: "Vibrant emerald pesto with crushed basil, pine nuts, and extra virgin olive oil.",
    imageUrl: "/images/ingredients/pesto_sauce.jpg"
  },

  // ==================== CHEESES ====================
  {
    name: "Fior Di Latte Fresh Mozzarella",
    category: "cheese",
    quantity: 55,
    lowStockThreshold: 12,
    price: 80,
    description: "Creamy whole-milk mozzarella that stretches beautifully.",
    imageUrl: "/images/ingredients/mozzarella_cheese.jpg"
  },
  {
    name: "Sharp Aged Cheddar",
    category: "cheese",
    quantity: 40,
    lowStockThreshold: 10,
    price: 90,
    description: "Bold, tangy, and rich cheddar aged for superior flavor.",
    imageUrl: "/images/ingredients/cheddar_cheese.jpg"
  },
  {
    name: "Parmigiano-Reggiano Flakes",
    category: "cheese",
    quantity: 30,
    lowStockThreshold: 8,
    price: 110,
    description: "Authentic Italian hard cheese with a nutty, crystalline crunch.",
    imageUrl: "/images/ingredients/parmesan_cheese.jpg"
  },
  {
    name: "Smoked Dutch Gouda",
    category: "cheese",
    quantity: 30,
    lowStockThreshold: 8,
    price: 95,
    description: "Subtly sweet with deep hickory smoke notes.",
    imageUrl: "/images/ingredients/gouda_cheese.jpg"
  },
  {
    name: "Artisan Vegan Mozzarella",
    category: "cheese",
    quantity: 20,
    lowStockThreshold: 5,
    price: 100,
    description: "Plant-based, 100% dairy-free smooth melting cheese.",
    imageUrl: "/images/ingredients/vegan_mozzarella.jpg"
  },

  // ==================== VEGETABLES ====================
  {
    name: "Fresh Portobello & Button Mushrooms",
    category: "vegetable",
    quantity: 40,
    lowStockThreshold: 10,
    price: 40,
    description: "Earthy, juicy sliced wild mushrooms.",
    imageUrl: "/images/ingredients/mushrooms.jpg"
  },
  {
    name: "Tricolor Crisp Bell Peppers",
    category: "vegetable",
    quantity: 50,
    lowStockThreshold: 12,
    price: 35,
    description: "Crunchy red, yellow, and green capsicums.",
    imageUrl: "/images/ingredients/bell_peppers.jpg"
  },
  {
    name: "Kalamata & Spanish Black Olives",
    category: "vegetable",
    quantity: 35,
    lowStockThreshold: 8,
    price: 45,
    description: "Sliced brine-cured Mediterranean black olives.",
    imageUrl: "/images/ingredients/black_olives.jpg"
  },
  {
    name: "Spicy Mexican Jalapeños",
    category: "vegetable",
    quantity: 35,
    lowStockThreshold: 8,
    price: 35,
    description: "Pickled spicy green jalapeño rings.",
    imageUrl: "/images/ingredients/jalapenos.jpg"
  },
  {
    name: "Crisp Red Bermuda Onions",
    category: "vegetable",
    quantity: 60,
    lowStockThreshold: 15,
    price: 25,
    description: "Sweet and crisp purple onion slivers.",
    imageUrl: "/images/ingredients/red_onions.jpg"
  },
  {
    name: "Sweet Golden American Corn",
    category: "vegetable",
    quantity: 45,
    lowStockThreshold: 10,
    price: 30,
    description: "Tender, juicy, and naturally sweet corn kernels.",
    imageUrl: "/images/ingredients/sweet_corn.jpg"
  },
  {
    name: "Organic Baby Spinach",
    category: "vegetable",
    quantity: 30,
    lowStockThreshold: 8,
    price: 40,
    description: "Tender farm-fresh baby spinach leaves.",
    imageUrl: "/images/ingredients/baby_spinach.jpg"
  },
  {
    name: "Sun-Dried Italian Tomatoes",
    category: "vegetable",
    quantity: 25,
    lowStockThreshold: 6,
    price: 55,
    description: "Intensely flavored dried tomatoes packed in herbs.",
    imageUrl: "/images/ingredients/sundried_tomatoes.jpg"
  }
];

const updateInventoryImages = async () => {
  try {
    await connectDB();
    console.log("Updating all MongoDB inventory items with real, authentic pictures...");

    // Remove legacy item named "Thin Crust" if duplicate
    await Inventory.deleteOne({ name: "Thin Crust" });

    for (const item of accurateIngredients) {
      await Inventory.findOneAndUpdate(
        { name: item.name },
        {
          $set: {
            category: item.category,
            quantity: item.quantity,
            lowStockThreshold: item.lowStockThreshold,
            price: item.price,
            description: item.description,
            imageUrl: item.imageUrl
          }
        },
        { upsert: true, returnDocument: "after" }
      );
      console.log(`Updated picture for: [${item.category.toUpperCase()}] ${item.name} -> ${item.imageUrl}`);
    }

    console.log("✅ All ingredients updated with real and accurate pictures!");
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error("Update failed:", err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
};

updateInventoryImages();
