const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../../cloudinary");
const upload = multer({ storage });



const {
  getItems,
  getItemsBySubcategory,
  getItem,
  addItem,
  updateItem,
  deleteItem,
} = require("../../controller/item");


router.get("/",  getItems);
router.get("/subcategory/:subcategoryId",  getItemsBySubcategory);
router.get("/:id", getItem);
router.post("/",  upload.single("image"), addItem);
router.put("/:id",  upload.single("image"), updateItem);
router.delete("/:id",  deleteItem);

module.exports = router;
