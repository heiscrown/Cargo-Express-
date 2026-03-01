const express = require("express");
const router = express.Router();

const shipmentController = require("../controllers/shipmentController");
const { verifyToken, authorizeRoles } = require("../middleware/authMiddleware");

/* =========================
   PUBLIC TRACKING ROUTE
   (No Login Required)
========================= */
router.get("/track/:trackingNumber", shipmentController.trackShipment);

/* =========================
   PROTECTED ROUTES
   (Admin / Manager Only)
========================= */

// Create shipment
router.post(
  "/",
  verifyToken,
  authorizeRoles("admin", "manager"),
  shipmentController.createShipment
);

// Get all shipments
router.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "manager"),
  shipmentController.getAllShipments
);

// Update shipment details
router.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "manager"),
  shipmentController.updateShipment
);

// Update shipment status
router.put(
  "/:id/status",
  verifyToken,
  authorizeRoles("admin", "manager"),
  shipmentController.updateStatus
);

module.exports = router;
