// models/categories.js
const mongoose = require("mongoose");

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String // Cloudinary URL
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Add this field for subcategories
  subcategories: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subcategory' // Make sure you have a Subcategory model
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model("Category", CategorySchema);