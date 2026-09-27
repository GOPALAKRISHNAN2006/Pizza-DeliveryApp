import mongoose from "mongoose";
import Order from "../model/Order.js";
import { emitOrderStatusUpdate } from "../sockets/socketHandler.js";

/**
 * Get all orders for Admin with filters and search
 * GET /api/admin/orders
 */
export const getAllOrders = async (req, res, next) => {
  try {
    const { status, search, limit = 50, page = 1 } = req.query;
    const query = {};

    if (status && status !== "All") {
      query.orderStatus = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const orders = await Order.find(query)
      .populate("user", "name email")
      .populate("items.base", "name price")
      .populate("items.sauce", "name price")
      .populate("items.cheese", "name price")
      .populate("items.vegetables", "name price")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const totalOrders = await Order.countDocuments(query);

    return res.status(200).json({
      success: true,
      count: orders.length,
      totalOrders,
      totalPages: Math.ceil(totalOrders / Number(limit)),
      currentPage: Number(page),
      orders
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get detailed single order by ID for Admin
 * GET /api/admin/orders/:id
 */
export const getAdminOrderById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Order ID format."
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

    return res.status(200).json({
      success: true,
      order
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Update order status by Admin
 * PATCH /api/admin/orders/:id/status
 */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const allowedStatuses = [
      "Order Received",
      "In Kitchen",
      "Sent to Delivery",
      "Delivered",
      "Cancelled"
    ];

    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Allowed: ${allowedStatuses.join(", ")}`
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

    order.orderStatus = status;
    const updatedOrder = await order.save();

    // Emit real-time Socket.IO notification to user dashboard & tracking page
    emitOrderStatusUpdate(updatedOrder);

    return res.status(200).json({
      success: true,
      message: `Order status successfully updated to "${status}".`,
      order: updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

export default {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus
};
