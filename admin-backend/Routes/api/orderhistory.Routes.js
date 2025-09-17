const express = require("express");
const router = express.Router();
const Order = require("../../models/ordermodel"); 

// GET all orders
router.get("/", async (req, res) => {
  try {
    const order = await Order.find().sort({ createdAt: -1 }); 
    console.log(order);
    res.status(200).json(order);
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// DELETE an order by ID
const mongoose = require("mongoose");

router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid Order ID" });
  }

  try {
    const deletedOrder = await Order.findByIdAndDelete(id);

    if (!deletedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: "Order deleted successfully", order: deletedOrder });
  } catch (error) {
    console.error("Failed to delete order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


module.exports = router;
