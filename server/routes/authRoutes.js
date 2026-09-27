import express from "express";
import {
  register,
  login,
  verifyEmail,
  forgotPassword,
  resetPassword,
  getMe
} from "../controllers/authController.js";
import { verifyUser } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email/:token", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.get("/me", verifyUser, getMe);

export default router;