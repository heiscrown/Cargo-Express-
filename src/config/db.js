const { Pool } = require("pg");

if (!process.env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined in .env");
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,

  // Stable production tuning
  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000,

  // Enable SSL automatically in production environments
  ssl:
    process.env.NODE_ENV === "production"
      ? { rejectUnauthorized: false }
      : false,
});

// Handle unexpected errors
pool.on("error", (err) => {
  console.error("Unexpected PostgreSQL error:", err);
});

// Clean export
module.exports = {
  query: (text, params) => pool.query(text, params),
  pool,
};
