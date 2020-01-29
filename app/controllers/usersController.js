// Models
const createUser = require("../models/createUser");
const readOneUser = require("../models/readOneUser");

// Packages
const jwt = require("jsonwebtoken");

// Helpers
const auth = require("../helpers/auth-module");
const bcrypt = require("../helpers/bcrypt-module");

exports.create_user = (req, res) => {
  const { firstName, lastName, email, username, password } = req.body;

  bcrypt.newPass(password).then(pwdRes => {
    if (pwdRes.status === 200) {
      const userInfo = {
        firstName,
        lastName,
        email,
        username,
        password: pwdRes.passwordHash
      };

      createUser
        .data(userInfo)
        .then(resolve => {
          delete resolve.password;
          jwt.sign(
            resolve,
            process.env.secret,
            { expiresIn: "1h" },
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
};

exports.read_one_user = (req, res) => {
  const username = req.params.username;
  readOneUser
    .data(username)
    .then(resolve => {
      let userObj = {
        user: resolve
      };
      delete userObj.user.password;
      res.send(userObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.read_login = (req, response) => {
  const { username, password } = req.body;

  readOneUser.data(username).then(user => {
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
};
