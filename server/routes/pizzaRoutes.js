import express from "express";
import { getPizzaOptions, getPresetPizzas } from "../controllers/pizzaController.js";

const router = express.Router();

router.get("/options", getPizzaOptions);
router.get("/presets", getPresetPizzas);

export default router;
