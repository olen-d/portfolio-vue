const express = require("express");
const app = express();

// const cors = require("cors");
// app.use(cors());
// const corsOptions = { origin: "*" };

const jwt = require("jsonwebtoken");





// Models

// Other stuff (mostly middleware)
const bcrypt = require("../helpers/bcrypt-module");
const auth = require("../helpers/auth-module");

// TODO: Fix this to serve up index.html
// TODO: Serve a proper 404 error page when something isn't found



// Export Routes for server.js

module.exports = app;
