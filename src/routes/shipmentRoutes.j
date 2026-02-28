const express = require("express");
const router = express.Router();

const {
  createShipment,
  getAllShipments,
  trackShipment
} = require("../controllers/shipmentController");

router.post("/", createShipment);
router.get("/", getAllShipments);
router.get("/track/:tracking_number", trackShipment);

module.exports = router;
