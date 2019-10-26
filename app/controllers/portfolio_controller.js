const express = require("express");
const app = express();

// const cors = require("cors");
// app.use(cors());
// const corsOptions = { origin: "*" };

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const path = require("path");

// Models

const contactOnly = require("../models/contactOnly");

// Other stuff (mostly middleware)
const bcrypt = require("../helpers/bcrypt-module");
const auth = require("../helpers/auth-module");

// TODO: Fix this to serve up index.html
// TODO: Serve a proper 404 error page when something isn't found

// Get just the contact information about a specific user
app.get("/api/about/contact/:username", (req, res, next) => {
  let userName = req.params.username;
  contactOnly
    .data(userName)
    .then(resolve => {
      let contactObj = {
        contact: resolve
      };
      res.send(contactObj);
    })
    .catch(err => {
      res.json(err);
    });
});

// Contact Form
// cors(corsOptions),
app.post("/api/contact/send", (req, res, next) => {
  let name = req.body.data.name;
  let email = req.body.data.email;
  let message = req.body.data.message;

  //Set up the mailer
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILUSER,
      pass: process.env.MAILPASS
    }
  });

  let mailOptions = {
    from: `${email}`,
    to: "contact@olen.dev",
    subject: `[OLEN.DEV] Website Contact Form Message From ${name}`,
    text: `${message} \n\n Contact Name: ${name} \nContact Email: ${email}`
  };

  transporter.sendMail(mailOptions, (err, success) => {
    if (err) {
      res.json({ error: err });
    } else {
      res.json(success);
    }
  });
});

app.use((req, res) => {
  // Fail
  // TODO - update this to send a fail JSON
  res.sendFile(path.join(__dirname, "../public", "404.html"));
});

// Export Routes for server.js

module.exports = app;
