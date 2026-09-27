import jwt from "jsonwebtoken";
import User from "../model/User.js";
import Admin from "../model/Admin.js";

/**
 * Middleware to authenticate normal registered users
 */
export const verifyUser = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Authorization token required. Please log in."
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      return res.status(403).json({
        success: false,
        message: "Access forbidden: User token invalid."
      });
    }

    const user = await User.findById(decoded.userId).select("-password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User account no longer exists."
      });
    }

    if (!user.isEmailVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email address to continue."
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Session expired. Please log in again."
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid authorization token."
    });
  }
};

/**
 * Middleware to authenticate administrators only
 */
export const verifyAdmin = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        success: false,
        message: "Admin authorization required. Please log in as admin."
      });
    }

    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: Token missing."
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Strictly check role is admin
    if (decoded.role !== "admin" || !decoded.adminId) {
      return res.status(403).json({
        success: false,
        message: "Access denied. Administrator privileges required."
      });
    }

    const admin = await Admin.findOne({ _id: decoded.adminId, role: "admin" }).select("-password");
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Admin account not found or unauthorized."
      });
    }

    req.admin = admin;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Admin session expired. Please log in again."
      });
    }
    return res.status(401).json({
      success: false,
      message: "Invalid admin authorization token."
    });
  }
};

// Aliases
export const authMiddleware = verifyAdmin;
export default {
  verifyUser,
  verifyAdmin,
  authMiddleware
};