// =====================================
// Cargo Express - Production Entry (ESM)
// =====================================

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import helmet from "helmet";

// Routes
import authRoutes from "./routes/authRoutes.js";
import shipmentRoutes from "./routes/shipmentRoutes.js";

const app = express();

// =====================
// Security
// =====================
app.use(helmet());
app.use(cors({
  origin: "*", // tighten later in production if needed
}));

app.use(express.json());

// =====================
// Health Check
// =====================
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cargo Express API is live 🚀",
    environment: process.env.NODE_ENV || "development"
  });
});

// =====================
// API Routes
// =====================
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);

// =====================
// 404 Handler
// =====================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found"
  });
});

// =====================
// Global Error Handler
// =====================
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

// =====================
// Start Server
// =====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
