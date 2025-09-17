const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudinary"); 
const upload = multer({ storage });

const {
  getChefs,
  addChef,
  deleteChef,
} = require("../../controller/chefs");

// ✅ Routes
router.get("/", getChefs);
router.post("/", upload.single("image"), addChef);
router.delete("/:id", deleteChef);

module.exports = router;
