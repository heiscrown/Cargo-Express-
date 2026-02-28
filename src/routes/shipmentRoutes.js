const express = require("express");
const router = express.Router();

const shipmentController = require("../controllers/shipmentController");
const auth = require("../middleware/authMiddleware");

// Public tracking
router.get("/track/:tracking_number", shipmentController.trackShipment);

// Protected routes (admin only)
router.post("/", auth, shipmentController.createShipment);
router.get("/", auth, shipmentController.getAllShipments);
router.put("/:id/status", auth, shipmentController.updateShipmentStatus);

module.exports = router;
