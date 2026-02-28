const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

/* =====================================================
   REGISTER USER (ADMIN OR STAFF)
===================================================== */
exports.register = async (req, res) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    // Check if user already exists
    const existingUser = await db.query(
      "SELECT id FROM admins WHERE username=$1",
      [username]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Username already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO admins (username, password, role)
       VALUES ($1, $2, COALESCE($3, 'admin'))
       RETURNING id, username, role`,
      [username, hashedPassword, role]
    );

    res.status(201).json({
      success: true,
      admin: result.rows[0],
    });
  } catch (error) {
    console.error("REGISTER_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

/* =====================================================
   LOGIN USER
===================================================== */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Username and password are required",
      });
    }

    const result = await db.query(
      "SELECT id, username, password, role FROM admins WHERE username=$1",
      [username]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const admin = result.rows[0];

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({
      success: true,
      token,
    });
  } catch (error) {
    console.error("LOGIN_ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
