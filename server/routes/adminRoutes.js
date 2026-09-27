import express from "express"
import {adminLogin,dashboard} from "../controllers/adminController.js";
import {addInventory,getInventory,
    updateInventory,patchInventory,
    getInventoryById,deleteInventory } from "../controllers/inventoryController.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const app=express.Router();
app.patch("/inventory/:id",authMiddleware,patchInventory);
app.post("/login",adminLogin);
app.get("/dashboard",authMiddleware,dashboard);
app.post("/inventory",authMiddleware,addInventory);
app.get("/inventory",authMiddleware,getInventory);
app.get("/inventory/:id",authMiddleware,getInventoryById);
app.put("/inventory/:id",authMiddleware,updateInventory);
app.delete("/inventory/:id",authMiddleware,deleteInventory);
export default app;

