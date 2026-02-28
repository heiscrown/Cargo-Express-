/* =====================================================
   SHIPMENT CONTROLLER
   Production-Ready Version
===================================================== */

const { Pool } = require("pg");

/* 
   Use environment variable DATABASE_URL
   Make sure it's set in .env
*/

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

/* =====================================================
   CREATE SHIPMENT
===================================================== */

exports.createShipment = async (req, res) => {
  try {
    const {
      sender_name,
      receiver_name,
      origin_country,
      destination_country
    } = req.body;

    if (!sender_name || !receiver_name || !origin_country || !destination_country) {
      return res.status(400).json({
        success: false,
        message: "All fields are required"
      });
    }

    const tracking_number = require("crypto")
      .randomUUID();

    const result = await pool.query(
      `INSERT INTO shipments 
       (tracking_number, sender_name, receiver_name, origin_country, destination_country)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        tracking_number,
        sender_name,
        receiver_name,
        origin_country,
        destination_country
      ]
    );

    res.json({
      success: true,
      shipment: result.rows[0]
    });

  } catch (err) {
    console.error("Create Shipment Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   GET ALL SHIPMENTS
===================================================== */

exports.getAllShipments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM shipments ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      shipments: result.rows
    });

  } catch (err) {
    console.error("Get Shipments Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   TRACK SHIPMENT (PUBLIC)
===================================================== */

exports.trackShipment = async (req, res) => {
  try {
    const { tracking_number } = req.params;

    const result = await pool.query(
      "SELECT * FROM shipments WHERE tracking_number = $1",
      [tracking_number]
    );

    if (result.rows.length === 0) {
      return res.json({
        success: false,
        message: "Shipment not found"
      });
    }

    res.json({
      success: true,
      shipment: result.rows[0]
    });

  } catch (err) {
    console.error("Track Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =====================================================
   UPDATE SHIPMENT STATUS
===================================================== */

exports.updateShipmentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: "Status is required"
      });
    }

    const result = await pool.query(
      `UPDATE shipments 
       SET current_status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2
       RETURNING *`,
      [status, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }

    res.json({
      success: true,
      shipment: result.rows[0]
    });

  } catch (err) {
    console.error("Update Status Error:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
