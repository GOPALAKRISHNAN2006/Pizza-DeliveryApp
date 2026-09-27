import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../model/Admin.js";
import Order from "../model/Order.js";
import Inventory from "../model/Inventory.js";

/**
 * Admin Login
 * POST /api/admin/login
 */
export const adminLogin = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Admin email and password are required."
      });
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials."
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid administrator credentials."
      });
    }

    const token = jwt.sign(
      {
        adminId: admin._id,
        role: "admin"
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    return res.status(200).json({
      success: true,
      message: "Admin authentication successful.",
      token,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role
      }
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Admin Dashboard Statistics
 * GET /api/admin/dashboard
 */
export const getAdminDashboard = async (req, res, next) => {
  try {
    // Aggregation metrics
    const totalOrders = await Order.countDocuments();
    const paidOrders = await Order.countDocuments({ paymentStatus: "Paid" });
    const pendingOrders = await Order.countDocuments({ orderStatus: { $in: ["Order Received", "In Kitchen", "Sent to Delivery"] } });
    const deliveredOrders = await Order.countDocuments({ orderStatus: "Delivered" });

    // Revenue calculation
    const revenueAgg = await Order.aggregate([
      { $match: { paymentStatus: "Paid" } },
      { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].totalRevenue : 0;

    // Inventory metrics
    const totalInventoryItems = await Inventory.countDocuments();
    const lowStockCount = await Inventory.countDocuments({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
    });
    const outOfStockCount = await Inventory.countDocuments({ quantity: 0 });

    const inventoryValueAgg = await Inventory.aggregate([
      { $group: { _id: null, totalValue: { $sum: { $multiply: ["$price", "$quantity"] } } } }
    ]);
    const totalInventoryValue = inventoryValueAgg.length > 0 ? inventoryValueAgg[0].totalValue : 0;

    // Recent orders
    const recentOrders = await Order.find()
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .limit(6);

    // Low stock items list
    const lowStockItems = await Inventory.find({
      $expr: { $lte: ["$quantity", "$lowStockThreshold"] }
    }).limit(8);

    return res.status(200).json({
      success: true,
      stats: {
        totalOrders,
        paidOrders,
        pendingOrders,
        deliveredOrders,
        totalRevenue,
        totalInventoryItems,
        lowStockCount,
        outOfStockCount,
        totalInventoryValue
      },
      recentOrders,
      lowStockItems,
      admin: req.admin
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get current logged in Admin
 * GET /api/admin/me
 */
export const getAdminMe = async (req, res, next) => {
  try {
    const admin = await Admin.findById(req.admin._id).select("-password");
    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin account not found."
      });
    }

    return res.status(200).json({
      success: true,
      admin
    });
  } catch (error) {
    next(error);
  }
};

export const dashboard = getAdminDashboard;

export default {
  adminLogin,
  getAdminDashboard,
  getAdminMe,
  dashboard
};
