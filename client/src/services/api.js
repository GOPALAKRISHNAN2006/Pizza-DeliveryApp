import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json"
  }
});

// Request interceptor: Attach JWT token from localStorage if available
api.interceptors.request.use(
  (config) => {
    // Check for admin token or user token based on request url or priority
    const adminToken = localStorage.getItem("oasis_admin_token");
    const userToken = localStorage.getItem("oasis_token");

    const token = config.url?.includes("/admin") ? adminToken || userToken : userToken || adminToken;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: Extract clean error message
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = {
      status: error.response?.status,
      message:
        error.response?.data?.message ||
        error.message ||
        "An unexpected error occurred. Please try again."
    };
    return Promise.reject(customError);
  }
);

export default api;
