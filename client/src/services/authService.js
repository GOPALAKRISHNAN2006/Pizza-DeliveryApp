import api from "./api";

export const registerUser = async (data) => {
  const res = await api.post("/auth/register", data);
  return res.data;
};

export const verifyUserEmail = async (token) => {
  const res = await api.get(`/auth/verify-email/${token}`);
  return res.data;
};

export const loginUser = async (data) => {
  const res = await api.post("/auth/login", data);
  return res.data;
};

export const forgotUserPassword = async (email) => {
  const res = await api.post("/auth/forgot-password", { email });
  return res.data;
};

export const resetUserPassword = async (token, password) => {
  const res = await api.post(`/auth/reset-password/${token}`, { password });
  return res.data;
};

export const getCurrentUser = async () => {
  const res = await api.get("/auth/me");
  return res.data;
};

export default {
  registerUser,
  verifyUserEmail,
  loginUser,
  forgotUserPassword,
  resetUserPassword,
  getCurrentUser
};
