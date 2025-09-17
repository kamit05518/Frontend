const mongoose = require("mongoose");

const SubcategorySchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" } // parent category
});

module.exports = mongoose.model("Subcategory", SubcategorySchema);
