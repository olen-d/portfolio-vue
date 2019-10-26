const express = require("express");
const app = express();

// const cors = require("cors");
// app.use(cors());
// const corsOptions = { origin: "*" };

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const path = require("path");

// Models
const about = require("../models/about");

const contactOnly = require("../models/contactOnly");
const findOneUser = require("../models/findOneUser");

// Admin Side
// Create

const createUser = require("../models/createUser");

// Other stuff (mostly middleware)
const bcrypt = require("../helpers/bcrypt-module");
const auth = require("../helpers/auth-module");

// TODO: Fix this to serve up index.html
// TODO: Serve a proper 404 error page when something isn't found

// Get information about a specific user
app.get("/api/about/user/:username", (req, res, next) => {
  let userName = req.params.username;
  about
    .data(userName)
    .then(resolve => {
      let aboutObj = {
        about: resolve
      };
      res.send(aboutObj);
    })
    .catch(err => {
      res.json(err);
    });
});

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

// Authentication Routes

app.post("/api/login", (req, response) => {
  const userName = req.body.userName;
  const password = req.body.password;

  findOneUser.data(userName).then(user => {
    if (user != null) {
      bcrypt
        .checkPass(password, user.password)
        .then(res => {
          if (res.status === 200 && res.login) {
            delete user.password;
            user.iss = "Portfolio Vue";
            jwt.sign(
              user,
              process.env.secret,
              { expiresIn: "1h" },
              (err, token) => {
                return response.status(200).json({
                  isLoggedIn: true,
                  token
                });
              }
            );
          } else {
            return response.status(500).json({
              isLoggedIn: false
            });
          }
        })
        .catch(error => {
          response.json(error);
        });
    } else {
      return response.status(404).json({
        isLoggedIn: false
      });
    }
  });
});

// Administrative Backend

// User related routes
// Create User
app.post("/api/user/create", (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const userName = req.body.userName;
  const password = req.body.password;

  bcrypt.newPass(password).then(pwdRes => {
    if (pwdRes.status === 200) {
      let userInfo = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userName: userName,
        password: pwdRes.passwordHash
      };

      createUser
        .data(userInfo)
        .then(resolve => {
          delete resolve.password;
          jwt.sign(
            resolve,
            process.env.secret,
            { expiresIn: "24h" },
            (err, token) => {
              return res.send({
                isLoggedIn: true,
                token
              });
            }
          );
        })
        .catch(err => {
          res.json(err);
        });
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
