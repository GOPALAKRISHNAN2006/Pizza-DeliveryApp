import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import authService from "../services/authService";
import adminService from "../services/adminService";
import { useToast } from "./ToastContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("oasis_user");
    return saved ? JSON.parse(saved) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("oasis_token") || null);

  const [admin, setAdmin] = useState(() => {
    const saved = localStorage.getItem("oasis_admin");
    return saved ? JSON.parse(saved) : null;
  });
  const [adminToken, setAdminToken] = useState(() => localStorage.getItem("oasis_admin_token") || null);

  const [loading, setLoading] = useState(true);
  const toast = useToast();

  // Restore & verify sessions on mount
  useEffect(() => {
    const initAuth = async () => {
      // Check user token
      if (token) {
        try {
          const data = await authService.getCurrentUser();
          if (data.user) {
            setUser(data.user);
            localStorage.setItem("oasis_user", JSON.stringify(data.user));
          }
        } catch (err) {
          console.warn("User session expired or invalid");
          logoutUser(false);
        }
      }

      // Check admin token
      if (adminToken) {
        try {
          const data = await adminService.getAdminMe();
          if (data.admin) {
            setAdmin(data.admin);
            localStorage.setItem("oasis_admin", JSON.stringify(data.admin));
          }
        } catch (err) {
          console.warn("Admin session expired or invalid");
          logoutAdmin(false);
        }
      }

      setLoading(false);
    };

    initAuth();
  }, []);

  // User Login
  const login = async (email, password) => {
    const data = await authService.loginUser({ email, password });
    if (data.token && data.user) {
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("oasis_token", data.token);
      localStorage.setItem("oasis_user", JSON.stringify(data.user));
      toast.success(data.message || "Logged in successfully!");
      return data;
    }
    throw new Error(data.message || "Login failed");
  };

  // User Register
  const register = async (name, email, password) => {
    const data = await authService.registerUser({ name, email, password });
    toast.success(data.message || "Account created! Please check your email.");
    return data;
  };

  // User Logout
  const logoutUser = (showToast = true) => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("oasis_token");
    localStorage.removeItem("oasis_user");
    if (showToast) toast.info("Logged out from user account");
  };

  // Admin Login
  const loginAsAdmin = async (email, password) => {
    const data = await adminService.adminLogin({ email, password });
    if (data.token && data.admin) {
      setAdminToken(data.token);
      setAdmin(data.admin);
      localStorage.setItem("oasis_admin_token", data.token);
      localStorage.setItem("oasis_admin", JSON.stringify(data.admin));
      toast.success("Admin authenticated successfully!");
      return data;
    }
    throw new Error(data.message || "Admin login failed");
  };

  // Admin Logout
  const logoutAdmin = (showToast = true) => {
    setAdmin(null);
    setAdminToken(null);
    localStorage.removeItem("oasis_admin_token");
    localStorage.removeItem("oasis_admin");
    if (showToast) toast.info("Logged out from admin panel");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token && !!user,
        admin,
        adminToken,
        isAdminAuthenticated: !!adminToken && !!admin,
        loading,
        login,
        register,
        logoutUser,
        loginAsAdmin,
        logoutAdmin
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
