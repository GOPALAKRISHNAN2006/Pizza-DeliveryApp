import api from "./api";

export const adminLogin = async (data) => {
  const res = await api.post("/admin/login", data);
  return res.data;
};

export const getAdminDashboard = async () => {
  const res = await api.get("/admin/dashboard");
  return res.data;
};

export const getAdminMe = async () => {
  const res = await api.get("/admin/me");
  return res.data;
};

// Inventory CRUD
export const getAdminInventory = async (params = {}) => {
  const res = await api.get("/admin/inventory", { params });
  return res.data;
};

export const getAdminInventoryById = async (id) => {
  const res = await api.get(`/admin/inventory/${id}`);
  return res.data;
};

export const addAdminInventory = async (data) => {
  const res = await api.post("/admin/inventory", data);
  return res.data;
};

export const updateAdminInventory = async (id, data) => {
  const res = await api.put(`/admin/inventory/${id}`, data);
  return res.data;
};

export const patchAdminInventory = async (id, data) => {
  const res = await api.patch(`/admin/inventory/${id}`, data);
  return res.data;
};

export const deleteAdminInventory = async (id) => {
  const res = await api.delete(`/admin/inventory/${id}`);
  return res.data;
};

// Admin Orders
export const getAdminOrders = async (params = {}) => {
  const res = await api.get("/admin/orders", { params });
  return res.data;
};

export const getAdminOrderById = async (id) => {
  const res = await api.get(`/admin/orders/${id}`);
  return res.data;
};

export const updateAdminOrderStatus = async (id, status) => {
  const res = await api.patch(`/admin/orders/${id}/status`, { status });
  return res.data;
};

export default {
  adminLogin,
  getAdminDashboard,
  getAdminMe,
  getAdminInventory,
  getAdminInventoryById,
  addAdminInventory,
  updateAdminInventory,
  patchAdminInventory,
  deleteAdminInventory,
  getAdminOrders,
  getAdminOrderById,
  updateAdminOrderStatus
};
