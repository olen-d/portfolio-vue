/* eslint-disable no-console */
require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");

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

// Routes
app.use("/api", require("./app/routes/mail"));
app.use("/api", require("./app/routes/profiles"));
app.use("/api", require("./app/routes/projects"));
app.use("/api", require("./app/routes/skills"));
app.use("/api", require("./app/routes/social"));
app.use("/api", require("./app/routes/users"));
app.use("/api", require("./app/routes/welcome"));

// Serve a 404 if none of the routes match
app.use((req, res) => {
  // Fail
  // TODO - update this to send a fail JSON
  res.sendFile(path.join(__dirname, "../public", "404.html"));
});

app.listen(port, () => console.log(`Portfolio API listening on port ${port}!`));
