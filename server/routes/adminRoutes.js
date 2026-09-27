import express from "express";
import { adminLogin, getAdminDashboard, getAdminMe } from "../controllers/adminController.js";
import {
  addInventory,
  getInventory,
  getInventoryById,
  updateInventory,
  patchInventory,
  deleteInventory
} from "../controllers/inventoryController.js";
import {
  getAllOrders,
  getAdminOrderById,
  updateOrderStatus
} from "../controllers/adminOrderController.js";
import { verifyAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

// Admin Auth
router.post("/login", adminLogin);
router.get("/dashboard", verifyAdmin, getAdminDashboard);
router.get("/me", verifyAdmin, getAdminMe);

// Admin Inventory Management
router.post("/inventory", verifyAdmin, addInventory);
router.get("/inventory", verifyAdmin, getInventory);
router.get("/inventory/:id", verifyAdmin, getInventoryById);
router.put("/inventory/:id", verifyAdmin, updateInventory);
router.patch("/inventory/:id", verifyAdmin, patchInventory);
router.delete("/inventory/:id", verifyAdmin, deleteInventory);

// Admin Order Management
router.get("/orders", verifyAdmin, getAllOrders);
router.get("/orders/:id", verifyAdmin, getAdminOrderById);
router.patch("/orders/:id/status", verifyAdmin, updateOrderStatus);

export default router;
