import React, { createContext, useContext, useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./AuthContext";
import { useToast } from "./ToastContext";

const SocketContext = createContext(null);

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || "http://localhost:5000";

export const SocketProvider = ({ children }) => {
  const { user, admin } = useAuth();
  const toast = useToast();
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [latestOrderStatusEvent, setLatestOrderStatusEvent] = useState(null);
  const [latestAdminOrderEvent, setLatestAdminOrderEvent] = useState(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      reconnectionAttempts: 10,
      reconnectionDelay: 2000
    });

    newSocket.on("connect", () => {
      console.log("🟢 Connected to Oasis Pizza real-time Socket.IO server:", newSocket.id);
      setIsConnected(true);

      // Join user room if logged in
      if (user?._id) {
        newSocket.emit("join_user_room", user._id);
      }

      // Join admin room if logged in as admin
      if (admin?._id) {
        newSocket.emit("join_admin_room");
      }
    });

    newSocket.on("disconnect", () => {
      console.log("🔴 Disconnected from Socket.IO server");
      setIsConnected(false);
    });

    // Real-time status update for specific user
    newSocket.on("user_order_updated", (data) => {
      console.log("🔔 Real-time User Order Updated:", data);
      setLatestOrderStatusEvent(data);
      toast.info(`Order #${data.orderId.slice(-6).toUpperCase()} is now: "${data.orderStatus}" 🍕`);
    });

    // Real-time status update for specific order room
    newSocket.on("order_status_updated", (data) => {
      console.log("🔔 Order Room Status Updated:", data);
      setLatestOrderStatusEvent(data);
    });

    // Admin receives new order
    newSocket.on("new_order_placed", (data) => {
      console.log("🚨 Admin: New Order Received:", data);
      setLatestAdminOrderEvent(data);
      toast.success("🔔 New customer pizza order received!");
    });

    newSocket.on("admin_order_updated", (data) => {
      setLatestAdminOrderEvent(data);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  // Update room subscriptions whenever user/admin auth changes
  useEffect(() => {
    if (!socket || !isConnected) return;

    if (user?._id) {
      socket.emit("join_user_room", user._id);
    }
    if (admin?._id) {
      socket.emit("join_admin_room");
    }
  }, [user, admin, socket, isConnected]);

  const joinOrderRoom = (orderId) => {
    if (socket && orderId) {
      socket.emit("join_order_room", orderId);
    }
  };

  const leaveOrderRoom = (orderId) => {
    if (socket && orderId) {
      socket.emit("leave_order_room", orderId);
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinOrderRoom,
        leaveOrderRoom,
        latestOrderStatusEvent,
        latestAdminOrderEvent
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

export default SocketContext;
