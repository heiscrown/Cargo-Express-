const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === "production"
    ? { rejectUnauthorized: false }
    : false
});

/* =========================================
   PUBLIC TRACKING
========================================= */
exports.trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    const result = await pool.query(
      "SELECT * FROM shipments WHERE tracking_number = $1",
      [trackingNumber]
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
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =========================================
   CREATE SHIPMENT
========================================= */
exports.createShipment = async (req, res) => {
  try {
    const {
      tracking_number,
      sender_name,
      receiver_name,
      origin_country,
      destination_country
    } = req.body;

    const result = await pool.query(
      `INSERT INTO shipments
      (tracking_number, sender_name, receiver_name, origin_country, destination_country)
      VALUES ($1,$2,$3,$4,$5)
      RETURNING *`,
      [
        tracking_number,
        sender_name,
        receiver_name,
        origin_country,
        destination_country
      ]
    );

    res.status(201).json({
      success: true,
      shipment: result.rows[0]
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =========================================
   GET ALL SHIPMENTS
========================================= */
exports.getAllShipments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM shipments ORDER BY created_at DESC"
    );

    res.json({
      success: true,
      count: result.rows.length,
      shipments: result.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =========================================
   UPDATE SHIPMENT
========================================= */
exports.updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const { sender_name, receiver_name } = req.body;

    const result = await pool.query(
      `UPDATE shipments
       SET sender_name=$1,
           receiver_name=$2
       WHERE id=$3
       RETURNING *`,
      [sender_name, receiver_name, id]
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
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

/* =========================================
   UPDATE STATUS
========================================= */
exports.updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { current_status } = req.body;

    const result = await pool.query(
      `UPDATE shipments
       SET current_status=$1
       WHERE id=$2
       RETURNING *`,
      [current_status, id]
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
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};
