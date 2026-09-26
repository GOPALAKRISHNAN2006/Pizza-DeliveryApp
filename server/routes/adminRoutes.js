import express from "express"
import {adminLogin,dashboard} from "../controllers/adminController.js"
import { authMiddleware } from "../middleware/authMiddleware.js";

const app=express.Router();
app.post("/login",adminLogin);
app.get("/dashboard",authMiddleware,dashboard);

export default app;

