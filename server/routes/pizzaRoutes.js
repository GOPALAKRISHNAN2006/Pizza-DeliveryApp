import express from "express";
import { getPizzaOptions, getPresetPizzas } from "../controllers/pizzaController.js";
import { publicCache } from "../middleware/cacheControl.js";

const router = express.Router();

// Public pizza options and presets cached with stale-while-revalidate
router.get("/options", publicCache(120, 300), getPizzaOptions);
router.get("/presets", publicCache(300, 600), getPresetPizzas);

export default router;
