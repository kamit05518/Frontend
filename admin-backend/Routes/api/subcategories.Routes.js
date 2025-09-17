const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudinary");
const { 
  authMiddleware,
  getSubcategories,
  getSubcategoriesByCategory,
  getSubcategory,
  addSubcategory,
  updateSubcategory,
  deleteSubcategory
} = require("../../controller/subcategories");

const upload = multer({ storage }); 

// Routes
router.get("/",authMiddleware, getSubcategories);
router.get("/:id",authMiddleware, getSubcategory);
router.get("/category/:categoryId",authMiddleware, getSubcategoriesByCategory);
router.post("/", upload.single("image"),authMiddleware, addSubcategory);
router.put("/:id", upload.single("image"),authMiddleware, updateSubcategory);
router.delete("/:id",authMiddleware, deleteSubcategory);

module.exports = router;
