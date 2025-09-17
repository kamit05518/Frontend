
const Menu = require("../models/menu");


exports.getMenuItems = async (req, res) => {
  try {
    const items = await Menu.find();
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch menu items" });
  }
};


exports.addMenuItem = async (req, res) => {
  try {
    const { name, price, subcategory, discount = 0 } = req.body;

    // Validate required fields
    if (!name || !price || !subcategory) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Cloudinary image path (URL)
    const image = req.file ? req.file.path : null;

    // Auto-generate delivery time (e.g., 40 to 70 mins)
    const time = Math.floor(Math.random() * 31) + 40;

    const newItem = new Menu({
      name: name.trim(),
      price,
      subcategory,
      image,
      discount,
      time
    });

    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error("Add Menu Item Error:", err);
    res.status(500).json({ error: "Failed to add menu item",err });
  }
};


// DELETE menu item
exports.deleteMenuItem = async (req, res) => {
  try {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ message: "Menu item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete menu item" });
  }
};
