import React, { createContext, useContext, useState, useCallback } from "react";
import { CheckCircle2, AlertCircle, AlertTriangle, Info, X } from "lucide-react";

const ToastContext = createContext(null);

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback((message, type = "info", duration = 4000) => {
    const id = Date.now() + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const success = useCallback((msg, dur) => addToast(msg, "success", dur), [addToast]);
  const error = useCallback((msg, dur) => addToast(msg, "error", dur), [addToast]);
  const warning = useCallback((msg, dur) => addToast(msg, "warning", dur), [addToast]);
  const info = useCallback((msg, dur) => addToast(msg, "info", dur), [addToast]);

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, warning, info }}>
      {children}
      <div className="toast-container">
        {toasts.map((toast) => {
          let IconComponent = Info;
          let toastClass = "toast-info";

          if (toast.type === "success") {
            IconComponent = CheckCircle2;
            toastClass = "toast-success";
          } else if (toast.type === "error") {
            IconComponent = AlertCircle;
            toastClass = "toast-error";
          } else if (toast.type === "warning") {
            IconComponent = AlertTriangle;
            toastClass = "toast-warning";
          }

          return (
            <div key={toast.id} className={`toast-item ${toastClass}`}>
              <IconComponent size={20} style={{ flexShrink: 0 }} />
              <div style={{ flex: 1, fontSize: "0.9rem", fontWeight: 500 }}>{toast.message}</div>
              <button
                onClick={() => removeToast(toast.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  color: "rgba(255,255,255,0.7)",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center"
                }}
              >
                <X size={16} />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export default ToastContext;
