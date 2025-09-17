const { model, Schema } = require("mongoose");

const RegisterSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    match: /^\d{10}$/,
    required: true,
  },
  token: {
    type: String, // 👈 yeh add karo
  },
  lastLogin: {
    type: Date, // 👈 yeh add karo
  },
});

module.exports = model("register", RegisterSchema);
