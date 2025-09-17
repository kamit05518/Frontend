const Router = require("express").Router();
const categoriesRouter = require("./Categories.Routes.js");
const chefsRouter = require("./Chefs.Routes.js");
const contactRouter = require("./contact.routes.js");
const subcategoriesRouter = require("./subcategories.Routes.js");
const itemsRouter = require("./item.Routes.js");
const authRouter =require("./auth.Routes.js")
const TracklocationRouter =require("./tracklocation.Routes.js");
const orderhistoryRouter =require("./orderhistory.Routes.js");

// Routes
Router.use("/contact", contactRouter);
Router.use("/chefs", chefsRouter);
Router.use("/categories", categoriesRouter);
Router.use("/subcategories", subcategoriesRouter);
Router.use("/items", itemsRouter);
Router.use("/auth",authRouter);
Router.use("/tracklocation",TracklocationRouter);
Router.use("/orderhistory",orderhistoryRouter);

Router.use((req, res) => {
  res.status(404).json({ error: "Route does not exist" });
});

module.exports = Router;
