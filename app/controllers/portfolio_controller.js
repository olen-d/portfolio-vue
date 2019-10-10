const express = require("express");
const app = express();

// const cors = require("cors");
// app.use(cors());
// const corsOptions = { origin: "*" };

const jwt = require("jsonwebtoken");

const nodemailer = require("nodemailer");

const path = require("path");

// Models
const welcome = require("../models/welcome");
const about = require("../models/about");
const projects = require("../models/projects");
const skills = require("../models/skills");
const skillsTop = require("../models/skillsTop");
const contactOnly = require("../models/contactOnly");
const social = require("../models/social");
const findOneUser = require("../models/findOneUser");

// Admin Side
const createUser = require("../models/createUser");
const updateHeadline = require("../models/updateHeadline");

// Other stuff
const bcrypt = require("../helpers/bcrypt-module");

// TODO: Fix this to serve up index.html
// TODO: Serve a proper 404 error page when something isn't found

// Get the welcome information
app.get("/api/welcome", (req, res, next) => {
  welcome
    .data()
    .then(resolve => {
      let welcomeObj = {
        welcome: resolve
      };
      res.send(welcomeObj);
    })
    .catch(err => {
      res.json(err);
    });
});

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

// Get the list of projects
app.get("/api/projects", (req, res, next) => {
  projects
    .data()
    .then(resolve => {
      let projectsObj = {
        projects: resolve
      };
      res.send(projectsObj);
    })
    .catch(err => {
      res.json(err);
    });
});

// Get all skills
app.get("/api/skills", (req, res, next) => {
  skills
    .data()
    .then(resolve => {
      let skillsObj = {
        skills: resolve
      };
      res.send(skillsObj);
    })
    .catch(err => {
      res.json(err);
    });
});

// Get the top skills
app.get("/api/skills/top/:limit", (req, res, next) => {
  let limit = parseInt(req.params.limit);
  skillsTop
    .data(limit)
    .then(resolve => {
      let skillsTopObj = {
        skills: resolve
      };
      res.send(skillsTopObj);
    })
    .catch(err => {
      res.json(err);
    });
});

// Get social media links for a specific user
app.get("/api/social/user/:username", (req, res, next) => {
  let userName = req.params.username;
  social
    .data(userName)
    .then(resolve => {
      let socialObj = {
        social: resolve
      };
      res.send(socialObj);
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
            jwt.sign(
              user,
              process.env.secret,
              { expiresIn: "24h" },
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

// Welcome related routes
// Update Headline

app.put("/api/welcome/update/headline/:headline_id", (req, res, next) => {
  let headline_id = req.params.headline_id;
  let headline = req.body.headline;

  let headlineData = {
    id: headline_id,
    headline: headline
  };

  updateHeadline.data(headlineData).then(resolve => {
    res.send(resolve);
  });
});

app.use((req, res) => {
  // Fail
  // TODO - update this to send a fail JSON
  res.sendFile(path.join(__dirname, "../public", "404.html"));
});

// Export Routes for server.js

module.exports = app;
