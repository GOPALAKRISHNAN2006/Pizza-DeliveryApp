import express from "express"
import { register,login } from "../controllers/authController.js";
const app = express.Router();
app.post("/register",register);
app.post("/login",login);

export default app;