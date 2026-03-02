import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/* ================================
   SECURITY & MIDDLEWARE
================================ */

app.use(cors({
  origin: "*", // You can restrict later to your frontend URL
}));

app.use(express.json());

/* ================================
   HEALTH CHECK
================================ */

app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Cargo Express API is running",
    timestamp: new Date().toISOString(),
  });
});

/* ================================
   AUTH ROUTE PLACEHOLDER
   (Your real auth logic should exist in routes file)
================================ */

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  // TEMP SIMPLE CHECK (replace with database logic)
  if (email === "admin@example.com" && password === "admin123") {
    return res.json({
      token: "demo-jwt-token",
      user: { role: "admin" },
    });
  }

  return res.status(401).json({
    success: false,
    message: "Invalid email or password",
  });
});

/* ================================
   GLOBAL ERROR HANDLER
================================ */

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

/* ================================
   START SERVER
================================ */

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
