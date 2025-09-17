const express = require("express");
const router = express.Router();
const path = require("path");
const multer = require("multer");
const { storage } = require("../../cloudinary");
const {
  addMenuItem,
  deleteMenuItem,
  getMenuItems,
} = require("../../controller/menu");

const upload = multer({ storage });

// ✅ Routes
router.get("/menu", getMenuItems);
router.post("/menu", upload.single("image"), addMenuItem); 
router.delete("/menu/:id", deleteMenuItem);

module.exports = router;
