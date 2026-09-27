import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import { initSocket } from "./sockets/socketHandler.js";
import { initLowStockCron } from "./jobs/lowStockJob.js";
import authRoutes from "./routes/authRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import pizzaRoutes from "./routes/pizzaRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
const io = initSocket(server);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true
  })
);

// Connect Database
connectDB();

// Initialize automated jobs
initLowStockCron();

// Health Check Route
app.get("/", (req, res) => {
  res.json({
    success: true,
    name: "Oasis Pizza API",
    version: "1.0.0",
    status: "healthy",
    timestamp: new Date()
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/pizzas", pizzaRoutes);
app.use("/api/orders", orderRoutes);

// Catch-all 404 handler for undefined API routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `API Route not found: ${req.method} ${req.originalUrl}`
  });
});

// Centralized Error Handling Middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log("==========================================");
  console.log(`🍕 Oasis Pizza Backend running on port ${PORT}`);
  console.log(`🌐 API Base URL: http://localhost:${PORT}`);
  console.log(`📡 WebSockets Active with Socket.IO`);
  console.log("==========================================");
});

export { app, server, io };