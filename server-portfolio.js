/* eslint-disable no-console */
require("dotenv").config();

const express = require("express");
const app = express();

if (process.env.ENVIRONMENT === "dev") {
  const cors = require("cors");
  app.use(cors());
}

const port = process.env.PORT || 3031;

// Sets up the Express app to handle data parsing
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Set up the css, js, and images directories
// app.use(express.static("public"));

// Modular Routes
app.use("/api", require("./app/routes/social"));
app.use("/api", require("./app/routes/welcome"));


// Import routes and give the server access to them.
const routes = require("./app/controllers/portfolio_controller.js");
app.use(routes);

app.listen(port, () => console.log(`Portfolio API listening on port ${port}!`));
