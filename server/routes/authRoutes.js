import express from "express"
import { register,login,verifyEmail,forgotPassword,resetPassword } from "../controllers/authController.js";
const app = express.Router();
app.post("/register",register);
app.post("/login",login);
app.get("/verify-email/:token",verifyEmail);
app.post("/forgot-password",forgotPassword);
app.post("/reset-password/:token",resetPassword);
export default app;