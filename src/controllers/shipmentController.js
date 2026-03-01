const { Pool } = require("pg");

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

/* =========================================
   PUBLIC: TRACK SHIPMENT
========================================= */
exports.trackShipment = async (req, res) => {
  try {
    const { trackingNumber } = req.params;

    if (!trackingNumber) {
      return res.status(400).json({
        success: false,
        message: "Tracking number is required"
      });
    }

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

    return res.json({
      success: true,
      shipment: result.rows[0]
    });

  } catch (error) {
    console.error("Track Shipment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* =========================================
   ADMIN: CREATE SHIPMENT
========================================= */
exports.createShipment = async (req, res) => {
  try {
    const {
      tracking_number,
      sender_name,
      receiver_name,
      origin_country,
      destination_country,
      current_status
    } = req.body;

    if (!tracking_number || !sender_name || !receiver_name) {
      return res.status(400).json({
        success: false,
        message: "Required fields missing"
      });
    }

    const result = await pool.query(
      `INSERT INTO shipments 
      (tracking_number, sender_name, receiver_name, origin_country, destination_country, current_status)
      VALUES ($1,$2,$3,$4,$5,$6)
      RETURNING *`,
      [
        tracking_number,
        sender_name,
        receiver_name,
        origin_country,
        destination_country,
        current_status || "Pending"
      ]
    );

    return res.status(201).json({
      success: true,
      shipment: result.rows[0]
    });

  } catch (error) {
    console.error("Create Shipment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* =========================================
   ADMIN: GET ALL SHIPMENTS
========================================= */
exports.getAllShipments = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM shipments ORDER BY created_at DESC"
    );

    return res.json({
      success: true,
      count: result.rows.length,
      shipments: result.rows
    });

  } catch (error) {
    console.error("Get Shipments Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* =========================================
   ADMIN: UPDATE SHIPMENT DETAILS
========================================= */
exports.updateShipment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      sender_name,
      receiver_name,
      origin_country,
      destination_country
    } = req.body;

    const result = await pool.query(
      `UPDATE shipments
       SET sender_name=$1,
           receiver_name=$2,
           origin_country=$3,
           destination_country=$4
       WHERE id=$5
       RETURNING *`,
      [
        sender_name,
        receiver_name,
        origin_country,
        destination_country,
        id
      ]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Shipment not found"
      });
    }

    return res.json({
      success: true,
      shipment: result.rows[0]
    });

  } catch (error) {
    console.error("Update Shipment Error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};


/* =========================================
   ADMIN: UPDATE SHIPMENT STATUS
========================================= */
exports.updateStatus =
