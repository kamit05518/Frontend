const Router = require("express").Router();
const Register = require("../../Controller/Register");
const login = require("../../Controller/Login");
const contact = require("../../Controller/contact.js")


Router.post("/contact",contact);
Router.post("/register", Register);
Router.post("/login", login);

module.exports = Router;
