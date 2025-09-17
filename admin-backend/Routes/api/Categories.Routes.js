const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudinary");

const {
  authMiddleware,
  addCategory,
  getCategories,
  deleteCategory,
  updateCategory,  
} = require("../../controller/categoriesroutes");

const upload = multer({ storage });

// ✅ Routes with authmiddleware
router.get("/categories", authMiddleware, getCategories);                            
router.post("/categories", upload.single("image"), authMiddleware, addCategory);     
router.put("/categories/:id", upload.single("image"), authMiddleware, updateCategory); 
router.delete("/categories/:id", authMiddleware, deleteCategory);                     

module.exports = router;
