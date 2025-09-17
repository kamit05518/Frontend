const Item = require("../models/item");
const Subcategory = require("../models/subcategories");

// GET all items
exports.getItems = async (req, res) => {
  try {
    const items = await Item.find().populate("subcategory", "name");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// GET items by subcategory
exports.getItemsBySubcategory = async (req, res) => {
  try {
    const { subcategoryId } = req.params;
    const items = await Item.find({ subcategory: subcategoryId }).populate(
      "subcategory",
      "name"
    );
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch items" });
  }
};

// GET single item
exports.getItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate(
      "subcategory",
      "name"
    );
    if (!item) return res.status(404).json({ error: "Item not found" });
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch item" });
  }
};

// ADD item
exports.addItem = async (req, res) => {
  try {
    const { name, description, price, subcategory, discount } = req.body;
    const image = req.file ? req.file.path : null; // ✅ Cloudinary URL

    if (!name || !price || !subcategory) {
      return res
        .status(400)
        .json({ error: "Name, price and subcategory are required" });
    }

    const subcategoryExists = await Subcategory.findById(subcategory);
    if (!subcategoryExists) {
      return res.status(400).json({ error: "Subcategory does not exist" });
    }

    const existingItem = await Item.findOne({
      name: name.trim(),
      subcategory,
    });
    if (existingItem) {
      return res
        .status(400)
        .json({ error: "Item already exists in this subcategory" });
    }

    const newItem = new Item({
      name: name.trim(),
      description,
      price,
      subcategory,
      discount: discount || 0, // ✅ discount add
      image, // ✅ Cloudinary URL store hoga
    });

    await newItem.save();
    await newItem.populate("subcategory", "name");

    res.status(201).json(newItem);
  } catch (err) {
    console.error("Add Item Error:", err);
    res.status(500).json({ error: "Failed to add item" });
  }
};

// UPDATE item
exports.updateItem = async (req, res) => {
  try {
    const { name, description, price, subcategory, discount } = req.body;
    const image = req.file ? req.file.path : undefined; // ✅ Cloudinary ka naya URL

    if (!name || !price || !subcategory) {
      return res
        .status(400)
        .json({ error: "Name, price and subcategory are required" });
    }

    const subcategoryExists = await Subcategory.findById(subcategory);
    if (!subcategoryExists) {
      return res.status(400).json({ error: "Subcategory does not exist" });
    }

    const existingItem = await Item.findOne({
      name: name.trim(),
      subcategory,
      _id: { $ne: req.params.id },
    });
    if (existingItem) {
      return res
        .status(400)
        .json({ error: "Item already exists in this subcategory" });
    }

    // ✅ discount ko updateData me add kar diya
    const updateData = {
      name: name.trim(),
      description,
      price,
      subcategory,
      discount: discount || 0,
    };

    if (image) updateData.image = image; // ✅ Agar image aayi to update karo

    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
      }
    ).populate("subcategory", "name");

    if (!updatedItem) return res.status(404).json({ error: "Item not found" });

    res.json(updatedItem);
  } catch (err) {
    console.error("Update Item Error:", err);
    res.status(500).json({ error: "Failed to update item" });
  }
};

// DELETE item
exports.deleteItem = async (req, res) => {
  try {
    const deletedItem = await Item.findByIdAndDelete(req.params.id);
    if (!deletedItem)
      return res.status(404).json({ error: "Item not found" });
    res.json({ message: "Item deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete item" });
  }
};
