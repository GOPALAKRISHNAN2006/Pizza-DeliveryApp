import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  pizzaName: {
    type: String,
    default: "Custom Handcrafted Pizza"
  },
  base: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true
  },
  sauce: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true
  },
  cheese: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Inventory",
    required: true
  },
  vegetables: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Inventory"
    }
  ],
  baseName: String,
  sauceName: String,
  cheeseName: String,
  vegetableNames: [String],
  quantity: {
    type: Number,
    default: 1,
    min: 1
  },
  itemPrice: {
    type: Number,
    required: true,
    min: 0
  }
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (v) => Array.isArray(v) && v.length > 0,
        message: "Order must contain at least one pizza"
      }
    },
    deliveryAddress: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      pincode: { type: String, required: true }
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0
    },
    paymentStatus: {
      type: String,
      enum: ["Pending", "Paid", "Failed", "Refunded"],
      default: "Pending"
    },
    orderStatus: {
      type: String,
      enum: ["Order Received", "In Kitchen", "Sent to Delivery", "Delivered", "Cancelled"],
      default: "Order Received"
    },
    razorpayOrderId: {
      type: String
    },
    razorpayPaymentId: {
      type: String
    },
    razorpaySignature: {
      type: String
    }
  },
  {
    timestamps: true
  }
);

// Index user and status for fast querying
orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderStatus: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
