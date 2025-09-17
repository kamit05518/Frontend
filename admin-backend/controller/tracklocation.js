const Order = require('../models/order');

// GET: Fetch all orders
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 }); // latest first
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST: Update step of an order
exports.updateOrderStep = async (req, res) => {
  const { orderId, step } = req.body;

  if (!orderId || typeof step !== 'number') {
    return res.status(400).json({ error: 'Invalid input data' });
  }

  const stepStatusMap = [
    'Order Placed',
    'Order Packed',
    'Out For Delivery',
    'Delivered'
  ];

  try {
    const updateFields = {
      step,
      status: stepStatusMap[step] || 'Pending'
    };

    // If order is delivered, set deliveredAt time
    if (step === 3) {
      updateFields.deliveredAt = new Date();
    }

    const updatedOrder = await Order.findOneAndUpdate(
      { orderId },
      updateFields,
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Order not found' });
    }

    res.json({
      message: 'Order updated successfully',
      order: updatedOrder
    });
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
