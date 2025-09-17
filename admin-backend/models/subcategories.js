// models/subcategories.js
const mongoose = require("mongoose");
const slugify = require("slugify"); // You may need to install this package

const SubcategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    unique: true,
    sparse: true // This allows multiple null values
  },
  description: {
    type: String,
    trim: true
  },
  image: {
    type: String // Cloudinary URL
  },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Generate slug from name before saving
SubcategorySchema.pre("save", function(next) {
  if (this.isModified("name") && this.name) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

module.exports = mongoose.model("Subcategory", SubcategorySchema);