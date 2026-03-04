// =====================================
// Cargo Express - Enterprise Database Config (ESM)
// =====================================

import pkg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pkg;

// Validate environment
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not defined in environment variables");
}

// Create connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Production performance tuning
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,

  // Render requires SSL in production
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Test connection on startup
pool.on("connect", () => {
  console.log("✅ Connected to PostgreSQL database");
});

pool.on("error", (err) => {
  console.error("❌ Unexpected PostgreSQL error:", err);
});
