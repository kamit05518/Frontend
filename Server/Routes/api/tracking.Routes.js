// routes/tracking.routes.js

const express = require("express");
const router = express.Router();
const { getOrderStatus } = require("../../Controller/tracking");

// GET /api/orders/:orderId/status
router.get("/orders/:orderId/status", getOrderStatus);

module.exports = router;
