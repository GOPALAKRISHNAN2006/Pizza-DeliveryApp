import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Item name is required"],
      trim: true
    },
    category: {
      type: String,
      required: [true, "Category is required"],
      enum: {
        values: ["base", "sauce", "cheese", "vegetable"],
        message: "{VALUE} is not a valid inventory category"
      }
    },
    quantity: {
      type: Number,
      required: [true, "Quantity is required"],
      min: [0, "Quantity cannot be negative"],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      required: [true, "Low stock threshold is required"],
      min: [0, "Threshold cannot be negative"],
      default: 10
    },
    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
      default: 0
    },
    lowStockAlertSent: {
      type: Boolean,
      default: false
    },
    imageUrl: {
      type: String,
      default: ""
    },
    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

// Index category for rapid pizza builder ingredient fetching
inventorySchema.index({ category: 1, quantity: 1 });

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;