const Subcategory = require("../models/subcategories");
const Category = require("../models/categories");
const mongoose = require("mongoose"); // Add this import
const jwt = require("jsonwebtoken");

// Simple auth middleware to verify JWT token
exports.authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // attach user info (id, roles etc) to req object
    next();
  } catch (err) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

// ✅ GET all subcategories
exports.getSubcategories = async (req, res) => {
  try {
    const subcategories = await Subcategory.find().populate("category", "name");
    res.json(subcategories);
  } catch (err) {
    console.error("Get Subcategories Error:", err);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

// ✅ GET subcategories by category ID
exports.getSubcategoriesByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Validate if categoryId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }
    
    const subcategories = await Subcategory.find({ category: categoryId });
    res.json(subcategories);
  } catch (err) {
    console.error("Get Subcategories By Category Error:", err);
    res.status(500).json({ error: "Failed to fetch subcategories" });
  }
};

// ✅ GET single subcategory
exports.getSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid subcategory ID" });
    }
    
    const subcategory = await Subcategory.findById(id).populate("category", "name");
    if (!subcategory) return res.status(404).json({ error: "Subcategory not found" });
    res.json(subcategory);
  } catch (err) {
    console.error("Get Subcategory Error:", err);
    res.status(500).json({ error: "Failed to fetch subcategory" });
  }
};

// ✅ ADD subcategory
exports.addSubcategory = async (req, res) => {
  try {
    const { name, description, category } = req.body;
    const image = req.file ? req.file.path : null; // This should be inside the function

    // Validate required fields
    if (!name || !category) {
      return res.status(400).json({ error: "Name and Category are required" });
    }

    // Validate if category is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    // Check if category exists
    const categoryExists = await Category.findById(category);
    if (!categoryExists) return res.status(400).json({ error: "Category does not exist" });

    // Check duplicate subcategory in same category
    const existingSubcategory = await Subcategory.findOne({ 
      name: name.trim(), 
      category 
    });
    
    if (existingSubcategory) {
      return res.status(409).json({ error: "Subcategory already exists in this category" });
    }

    const newSubcategory = new Subcategory({ 
      name: name.trim(), 
      description, 
      image, 
      category 
    });
    
    await newSubcategory.save();
    await newSubcategory.populate("category", "name");

    res.status(201).json(newSubcategory);
  } catch (err) {
    console.error("Add Subcategory Error:", err);
    res.status(500).json({ error: "Failed to add subcategory" });
  }
};

// ✅ UPDATE subcategory
exports.updateSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category } = req.body;
    const image = req.file ? req.file.path : undefined;

    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid subcategory ID" });
    }

    if (!name || !category) {
      return res.status(400).json({ error: "Name and Category are required" });
    }

    // Validate if category is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(category)) {
      return res.status(400).json({ error: "Invalid category ID" });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) return res.status(400).json({ error: "Category does not exist" });

    const existingSubcategory = await Subcategory.findOne({
      name: name.trim(),
      category,
      _id: { $ne: id }
    });
    
    if (existingSubcategory) {
      return res.status(409).json({ error: "Subcategory already exists in this category" });
    }

    const updateData = { name: name.trim(), description, category };
    if (image) updateData.image = image;

    const updatedSubcategory = await Subcategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    ).populate("category", "name");

    if (!updatedSubcategory) return res.status(404).json({ error: "Subcategory not found" });

    res.json(updatedSubcategory);
  } catch (err) {
    console.error("Update Subcategory Error:", err);
    res.status(500).json({ error: "Failed to update subcategory" });
  }
};

// ✅ DELETE subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Validate if id is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid subcategory ID" });
    }
    
    const deletedSubcategory = await Subcategory.findByIdAndDelete(id);
    if (!deletedSubcategory) return res.status(404).json({ error: "Subcategory not found" });
    res.json({ message: "Subcategory deleted successfully" });
  } catch (err) {
    console.error("Delete Subcategory Error:", err);
    res.status(500).json({ error: "Failed to delete subcategory" });
  }
};