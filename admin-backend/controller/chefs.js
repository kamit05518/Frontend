const Chef = require("../models/chefs");

// GET all chefs
exports.getChefs = async (req, res) => {
  try {
    const chefs = await Chef.find();
    res.json(chefs);
  } catch (err) {
    res.status(500).json({ error: "Failed to get chefs" });
  }
};

// POST a new chef
exports.addChef = async (req, res) => {
  try {
    const { name, specialty } = req.body;

    if (!req.file) return res.status(400).json({ error: "Image is required" });

    const newChef = new Chef({
      name,
      specialty,
      image: req.file.path,
    });

    await newChef.save();
    res.status(201).json(newChef);
  } catch (err) {
    res.status(500).json({ error: "Failed to add chef" });
  }
};

// DELETE a chef
exports.deleteChef = async (req, res) => {
  try {
    await Chef.findByIdAndDelete(req.params.id);
    res.json({ message: "Chef deleted" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete chef" });
  }
};
