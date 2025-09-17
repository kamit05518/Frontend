const mongoose = require("mongoose");

// Schema for individual items in the cart
const cartItemSchema = new mongoose.Schema({
  itemId: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  image: { type: String },
  category: { type: String },
});

// Main order schema
const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  
  cartItems: {
    type: [cartItemSchema],
    required: true,
  },

  totalPrice: { type: Number, required: true },
  address: { type: String, required: true },

  paymentMethod: {
    type: String,
    enum: ["cod", "online"],
    required: true,
  },

  status: {
    type: String,
    default: "Pending",
    enum: ["Pending", "Confirmed", "Preparing", "Dispatched", "Delivered", "Cancelled"],
  },

  step: {
    type: Number,
    default: 0, // 0 = Order Placed
    min: 0,
    max: 3,
  },

  deliveredAt: { type: Date },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Ordermodel", orderSchema);
