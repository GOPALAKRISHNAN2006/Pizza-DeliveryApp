import express from "express";
import {
  createPaymentOrder,
  verifyPaymentAndCreateOrder,
  getUserOrders,
  getOrderById
} from "../controllers/orderController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/create-payment", verifyUser, createPaymentOrder);
router.post("/verify-payment", verifyUser, verifyPaymentAndCreateOrder);
router.get("/my-orders", verifyUser, getUserOrders);
router.get("/:id", verifyUser, getOrderById);

export default router;
