import { Server } from "socket.io";

let io = null;

/**
 * Initializes Socket.IO with HTTP server
 */
export const initSocket = (httpServer) => {
  io = new Server(httpServer, {
    cors: {
      origin: "*",
      methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Socket connected: ${socket.id}`);

    // User joins personal room for user-specific updates
    socket.on("join_user_room", (userId) => {
      if (userId) {
        socket.join(`user_${userId}`);
        console.log(`User ${userId} joined room: user_${userId}`);
      }
    });

    // Client joins specific order room for live tracking
    socket.on("join_order_room", (orderId) => {
      if (orderId) {
        socket.join(`order_${orderId}`);
        console.log(`Socket ${socket.id} joined room: order_${orderId}`);
      }
    });

    // Leave order room
    socket.on("leave_order_room", (orderId) => {
      if (orderId) {
        socket.leave(`order_${orderId}`);
        console.log(`Socket ${socket.id} left room: order_${orderId}`);
      }
    });

    // Admin joins admin room for live order reception
    socket.on("join_admin_room", () => {
      socket.join("admin_room");
      console.log(`Socket ${socket.id} joined admin_room`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Socket disconnected: ${socket.id}`);
    });
  });

  return io;
};

/**
 * Get the current Socket.IO instance
 */
export const getIO = () => {
  if (!io) {
    console.warn("Socket.io has not been initialized yet");
  }
  return io;
};

/**
 * Broadcast order status update to user and order tracking rooms
 */
export const emitOrderStatusUpdate = (order) => {
  if (!io) return;

  const orderId = order._id.toString();
  const userId = (order.user?._id || order.user)?.toString();

  const payload = {
    orderId,
    orderStatus: order.orderStatus,
    updatedAt: order.updatedAt,
    order
  };

  // Broadcast to specific order tracking room
  io.to(`order_${orderId}`).emit("order_status_updated", payload);

  // Broadcast to user dashboard room
  if (userId) {
    io.to(`user_${userId}`).emit("user_order_updated", payload);
  }

  // Broadcast to admin dashboard
  io.to("admin_room").emit("admin_order_updated", payload);
};

/**
 * Broadcast new order event to admin dashboard
 */
export const emitNewOrder = (order) => {
  if (!io) return;

  io.to("admin_room").emit("new_order_placed", {
    message: "New pizza order placed!",
    order
  });

  const userId = (order.user?._id || order.user)?.toString();
  if (userId) {
    io.to(`user_${userId}`).emit("user_order_created", {
      message: "Order placed successfully!",
      order
    });
  }
};

export default {
  initSocket,
  getIO,
  emitOrderStatusUpdate,
  emitNewOrder
};
