const express = require('express');
const router = express.Router();
const {
  getAllOrders,
  updateOrderStep
} = require('../../controller/tracklocation');


router.get('/orders', getAllOrders);
router.post('/orders/update-step', updateOrderStep);

module.exports = router;
