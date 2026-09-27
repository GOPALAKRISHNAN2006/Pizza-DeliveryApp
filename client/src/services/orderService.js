import api from "./api";

export const createPayment = async (orderData) => {
  const res = await api.post("/orders/create-payment", orderData);
  return res.data;
};

export const verifyPayment = async (verificationData) => {
  const res = await api.post("/orders/verify-payment", verificationData);
  return res.data;
};

export const getMyOrders = async () => {
  const res = await api.get("/orders/my-orders");
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};

export default {
  createPayment,
  verifyPayment,
  getMyOrders,
  getOrderById
};
