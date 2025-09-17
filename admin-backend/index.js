const express = require("express");
const backend = express();
const cors = require("cors");
require('dotenv').config();
backend.use(express.json());
const connectDB = require("./config/db");
const Routes = require("./Routes/index");

backend.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["POST", "GET", "DELETE","PUT"],
  })
);
backend.use(Routes);

connectDB();
const PORT = process.env.PORT || 5000;
backend.listen(PORT, () => console.log(`Server running on port ${PORT}`));
