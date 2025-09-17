const Router = require("express").Router();
const Register = require("../../controller/registeration");
const login = require("../../controller/login");


Router.post("/register", Register);
Router.post("/login", login);

module.exports = Router;
