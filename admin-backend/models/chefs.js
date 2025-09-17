const mongoose = require("mongoose");

const chefSchema = new mongoose.Schema({
  name: { type: String, required: true },
  specialty: { type: String, required: true },
  //experience: { type: Number, required: true }, 
  image: { type: String, required: true }
});

module.exports = mongoose.model("Chef", chefSchema);
