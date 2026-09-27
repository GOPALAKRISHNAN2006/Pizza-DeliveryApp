import mongoose from "mongoose";
import Inventory from "../model/Inventory.js";
import Order from "../model/Order.js";
import { createRazorpayOrder, verifyRazorpaySignature } from "../services/paymentService.js";
import { emitNewOrder } from "../sockets/socketHandler.js";
import { checkLowStock } from "../jobs/lowStockJob.js";

/**
 * Helper to extract pure ID string or ObjectId
 */
const extractId = (val) => {
  if (!val) return null;
  if (typeof val === "object") {
    return val._id ? val._id.toString() : val.toString();
  }
  return val.toString();
};

/**
 * Helper to validate a pizza configuration and calculate true price from DB
 */
const validateAndCalculatePizzaPrice = async (item) => {
  const baseId = extractId(item.baseId || item.base);
  const sauceId = extractId(item.sauceId || item.sauce);
  const cheeseId = extractId(item.cheeseId || item.cheese);

  let rawVegs = item.vegetableIds || item.vegetables || [];
  if (!Array.isArray(rawVegs)) rawVegs = [];
  const vegetableIds = rawVegs.map((v) => extractId(v)).filter(Boolean);

  if (!baseId || !sauceId || !cheeseId) {
    throw new Error("Each pizza must include a Base, a Sauce, and a Cheese.");
  }

  // Fetch all ingredients from MongoDB to ensure valid items and genuine prices
  const allIds = [baseId, sauceId, cheeseId, ...vegetableIds];
  const ingredients = await Inventory.find({ _id: { $in: allIds } });

  const baseItem = ingredients.find((i) => i._id.toString() === baseId);
  const sauceItem = ingredients.find((i) => i._id.toString() === sauceId);
  const cheeseItem = ingredients.find((i) => i._id.toString() === cheeseId);

  if (!baseItem || baseItem.category !== "base") {
    throw new Error("Invalid or unavailable pizza base selected.");
  }
  if (!sauceItem || sauceItem.category !== "sauce") {
    throw new Error("Invalid or unavailable pizza sauce selected.");
  }
  if (!cheeseItem || cheeseItem.category !== "cheese") {
    throw new Error("Invalid or unavailable pizza cheese selected.");
  }

  // Check stock
  if (baseItem.quantity < 1) throw new Error(`Selected base "${baseItem.name}" is out of stock.`);
  if (sauceItem.quantity < 1) throw new Error(`Selected sauce "${sauceItem.name}" is out of stock.`);
  if (cheeseItem.quantity < 1) throw new Error(`Selected cheese "${cheeseItem.name}" is out of stock.`);

  const veggieItems = [];
  let veggieTotal = 0;

  for (const vId of vegetableIds) {
    const vItem = ingredients.find((i) => i._id.toString() === vId);
    if (!vItem || vItem.category !== "vegetable") {
      throw new Error(`Invalid vegetable ingredient with ID: ${vId}`);
    }
    if (vItem.quantity < 1) {
      throw new Error(`Selected vegetable "${vItem.name}" is currently out of stock.`);
    }
    veggieItems.push(vItem);
    veggieTotal += Number(vItem.price);
  }

  const calculatedItemPrice = Number(baseItem.price) + Number(sauceItem.price) + Number(cheeseItem.price) + veggieTotal;
  const quantity = Number(item.quantity) || 1;

  return {
    base: baseItem._id,
    sauce: sauceItem._id,
    cheese: cheeseItem._id,
    vegetables: veggieItems.map((v) => v._id),
    baseName: baseItem.name,
    sauceName: sauceItem.name,
    cheeseName: cheeseItem.name,
    vegetableNames: veggieItems.map((v) => v.name),
    pizzaName: item.pizzaName || "Custom Handcrafted Pizza",
    quantity,
    itemPrice: calculatedItemPrice,
    totalItemPrice: calculatedItemPrice * quantity,
    requiredIngredientIds: [baseItem._id, sauceItem._id, cheeseItem._id, ...veggieItems.map((v) => v._id)]
  };
};

/**
 * Create Razorpay payment order
 * POST /api/orders/create-payment
 */
export const createPaymentOrder = async (req, res, next) => {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart must contain at least one customized pizza."
      });
    }

    if (
      !deliveryAddress ||
      !deliveryAddress.name ||
      !deliveryAddress.phone ||
      !deliveryAddress.street ||
      !deliveryAddress.city ||
      !deliveryAddress.pincode
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a complete delivery address (name, phone, street, city, pincode)."
      });
    }

    // Validate every pizza and compute true price from MongoDB
    let totalCalculatedAmount = 0;
    const validatedItems = [];

    for (const item of items) {
      const validated = await validateAndCalculatePizzaPrice(item);
      validatedItems.push(validated);
      totalCalculatedAmount += validated.totalItemPrice;
    }

    const finalAmount = Math.max(1, totalCalculatedAmount);

    const receipt = `oasis_${Date.now()}_${req.user._id.toString().substring(0, 6)}`;
    const razorpayOrder = await createRazorpayOrder(finalAmount, receipt, {
      userId: req.user._id.toString(),
      userName: req.user.name,
      userEmail: req.user.email
    });

    return res.status(200).json({
      success: true,
      message: "Payment order initialized successfully.",
      razorpayOrder: {
        id: razorpayOrder.orderId,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        keyId: razorpayOrder.keyId,
        isMock: razorpayOrder.isMock
      },
      orderSummary: {
        items: validatedItems,
        totalAmount: finalAmount,
        deliveryAddress
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Verify Razorpay payment and commit the order with stock deduction
 * POST /api/orders/verify-payment
 */
export const verifyPaymentAndCreateOrder = async (req, res, next) => {
  try {
    const {
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      items,
      deliveryAddress
    } = req.body;

    if (!razorpayOrderId || !razorpayPaymentId) {
      return res.status(400).json({
        success: false,
        message: "Razorpay payment details (orderId, paymentId) are required."
      });
    }

    // Verify payment signature
    const isSignatureValid = verifyRazorpaySignature({
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    if (!isSignatureValid) {
      return res.status(400).json({
        success: false,
        message: "Invalid payment signature. Payment verification failed."
      });
    }

    // Validate items again to ensure atomic safety and compute correct total
    let totalCalculatedAmount = 0;
    const validatedItems = [];
    const ingredientDeductionList = [];

    for (const item of items) {
      const validated = await validateAndCalculatePizzaPrice(item);
      validatedItems.push(validated);
      totalCalculatedAmount += validated.totalItemPrice;

      // Collect required ingredient IDs for deduction
      for (let i = 0; i < validated.quantity; i++) {
        ingredientDeductionList.push(...validated.requiredIngredientIds);
      }
    }

    // Atomically verify stock availability and deduct inventory
    for (const ingredientId of ingredientDeductionList) {
      const deductionResult = await Inventory.findOneAndUpdate(
        {
          _id: ingredientId,
          quantity: { $gte: 1 }
        },
        {
          $inc: { quantity: -1 }
        },
        { returnDocument: "after" }
      );

      if (!deductionResult) {
        const itemInfo = await Inventory.findById(ingredientId);
        return res.status(409).json({
          success: false,
          message: `Ingredient "${itemInfo?.name || 'Item'}" ran out of stock right before completion. Please adjust your order.`
        });
      }
    }

    // Create the finalized Order in MongoDB
    const order = await Order.create({
      user: req.user._id,
      items: validatedItems.map((i) => ({
        pizzaName: i.pizzaName,
        base: i.base,
        sauce: i.sauce,
        cheese: i.cheese,
        vegetables: i.vegetables,
        baseName: i.baseName,
        sauceName: i.sauceName,
        cheeseName: i.cheeseName,
        vegetableNames: i.vegetableNames,
        quantity: i.quantity,
        itemPrice: i.itemPrice
      })),
      deliveryAddress,
      totalAmount: totalCalculatedAmount,
      paymentStatus: "Paid",
      orderStatus: "Order Received",
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature
    });

    // Populate user and items info for response & sockets
    const populatedOrder = await Order.findById(order._id)
      .populate("user", "name email")
      .populate("items.base", "name price")
      .populate("items.sauce", "name price")
      .populate("items.cheese", "name price")
      .populate("items.vegetables", "name price");

    // Real-time broadcast via Socket.IO
    try {
      emitNewOrder(populatedOrder);
    } catch (sockErr) {
      console.warn("Socket broadcast note:", sockErr.message);
    }

    // Trigger low stock check in the background without blocking response
    setTimeout(() => {
      checkLowStock().catch((e) => console.error("Async low stock check failed:", e));
    }, 100);

    return res.status(201).json({
      success: true,
      message: "Payment confirmed and order placed successfully!",
      order: populatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get orders belonging to currently logged-in user
 * GET /api/orders/my-orders
 */
export const getUserOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate("items.base", "name price")
      .populate("items.sauce", "name price")
      .populate("items.cheese", "name price")
      .populate("items.vegetables", "name price")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get specific order by ID (with ownership check)
 * GET /api/orders/:id
 */
export const getOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID format."
      });
    }

    const order = await Order.findById(id)
      .populate("user", "name email")
      .populate("items.base", "name price")
      .populate("items.sauce", "name price")
      .populate("items.cheese", "name price")
      .populate("items.vegetables", "name price");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    // Check authorization
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: You do not own this order."
      });
    }

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

export default {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  getUserOrders,
  getOrderById
};
