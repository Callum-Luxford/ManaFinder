const express = require("express");
const expressLayouts = require("express-ejs-layouts");
require("dotenv").config();
const routes = require("./server/routes/main");

// APP INSTANCE
const app = express();

// SET VIEW ENGINE
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

// MIDDLEWARE
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(expressLayouts);

// ROUTES MIDDLEWARE
app.use("/", routes);

// START SERVER
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});
