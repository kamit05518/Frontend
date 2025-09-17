// ✅ Best practice: define all as functions, then export them together

const Category = require("../models/categories");
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "Access denied" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "mysecretkey");
    req.userId = decoded.id; 
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token" });
  }
};

const getCategories = async (req, res) => {
  try {
    const categories = await Category.find().populate("subcategories");
    res.json(categories);
  } catch (err) {
    console.error("Fetch Categories Error:", err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

const addCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : null;

    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }

    const existingCategory = await Category.findOne({ name: name.trim() });
    if (existingCategory) {
      return res.status(400).json({ error: "Category already exists" });
    }

    const newCategory = new Category({ name: name.trim(), description, image });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    console.error("Add Category Error:", err);
    res.status(500).json({ error: "Failed to add category" });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const image = req.file ? req.file.path : null;

    const updateData = {};
    if (name) updateData.name = name.trim();
    if (description) updateData.description = description;
    if (image) updateData.image = image;

    const updatedCategory = await Category.findByIdAndUpdate(req.params.id, updateData, { new: true });

    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }

    res.json(updatedCategory);
  } catch (err) {
    console.error("Update Category Error:", err);
    res.status(500).json({ error: "Failed to update category" });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error("Delete Category Error:", err);
    res.status(500).json({ error: "Failed to delete category" });
  }
};

// ✅ Export all
module.exports = {
  authMiddleware,
  getCategories,
  addCategory,
  updateCategory,
  deleteCategory,
};
