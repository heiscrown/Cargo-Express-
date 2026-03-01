require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

/* ==============================
   MIDDLEWARE
================================= */
app.use(cors());
app.use(express.json());

/* ==============================
   HEALTH CHECK (IMPORTANT)
================================= */
app.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "Cargo Express API is running",
    timestamp: new Date().toISOString()
  });
});

/* ==============================
   BASIC ROOT ROUTE
================================= */
app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Welcome to Cargo Express API"
  });
});

/* ==============================
   ROUTES
================================= */
const shipmentRoutes = require("./routes/shipmentRoutes");
app.use("/api/shipments", shipmentRoutes);

/* ==============================
   GLOBAL ERROR HANDLER
================================= */
app.use((err, req, res, next) => {
  console.error("Server Error:", err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });
});

/* ==============================
   START SERVER
================================= */
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
