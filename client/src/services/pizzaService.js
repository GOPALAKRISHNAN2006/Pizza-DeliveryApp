import api from "./api";

export const getPizzaOptions = async () => {
  const res = await api.get("/pizzas/options");
  return res.data;
};

export const getPresetPizzas = async () => {
  const res = await api.get("/pizzas/presets");
  return res.data;
};

export default {
  getPizzaOptions,
  getPresetPizzas
};
