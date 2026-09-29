import api from "./api";
import { cachedApiCall, clearApiCache } from "./apiCache";

export const getPizzaOptions = async (forceRefresh = false) => {
  if (forceRefresh) clearApiCache("pizza_options");
  return cachedApiCall("pizza_options", async () => {
    const res = await api.get("/pizzas/options");
    return res.data;
  }, 2 * 60 * 1000); // 2 minutes cache
};

export const getPresetPizzas = async (forceRefresh = false) => {
  if (forceRefresh) clearApiCache("pizza_presets");
  return cachedApiCall("pizza_presets", async () => {
    const res = await api.get("/pizzas/presets");
    return res.data;
  }, 5 * 60 * 1000); // 5 minutes cache
};

export const invalidatePizzaCache = () => {
  clearApiCache("pizza_");
};

export default {
  getPizzaOptions,
  getPresetPizzas,
  invalidatePizzaCache
};
