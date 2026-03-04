// =====================================
// Cargo Express - Enterprise Entry Point
// =====================================

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

const authRoutes = require("./routes/authRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");

const app = express();

// ----------------------
// Security Middleware
// ----------------------
app.use(helmet());
app.use(cors());
app.use(express.json());

// ----------------------
// Health Check
// ----------------------
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Cargo Express API is running 🚀",
  });
});

// ----------------------
// API Routes
// ----------------------
app.use("/api/auth", authRoutes);
app.use("/api/shipments", shipmentRoutes);

// ----------------------
// Global Error Handler
// ----------------------
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// ----------------------
// Start Server
// ----------------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
