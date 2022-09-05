// Models
const createHeadline = require("../models/createHeadline");
const readWelcome = require("../models/readWelcome");
const updateHeadline = require("../models/updateHeadline");

// Helpers
const auth = require("../helpers/auth-module");

exports.create_headline = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const { body: { userId, headline } } = req;

        const headlineInfo = {
          userId,
          headline
        };

        createHeadline
          .data(headlineInfo)
          .then(response => {
            res.json(response);
          })
          .catch(err => {
            res.status(500).json({
              message: "Internal server error",
              error: err
            });
          });
      } else {
        res.status(403).json({
          type: "error",
          message:
            "You must be logged in and have administrator privileges to perform this function"
        });
      }
    })
    .catch(err => {
      res.status(403).json({
        message: "Could not create headline",
        error: err
      });
    });
};

exports.read_welcome = (req, res) => {
  readWelcome
    .data()
    .then(resolve => {
      const welcomeObj = {
        welcome: resolve
      };
      res.send(welcomeObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.update_headline = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const headline_id = req.params.headline_id;
        const headline = req.body.headline;

        const headlineData = {
          id: headline_id,
          headline: headline
        };

        updateHeadline
          .data(headlineData)
          .then(resolve => {
            return res.json(resolve);
          })
          .catch(err => {
            res.status(500).json({
              message: "Internal server error",
              error: err
            });
          });
      } else {
        res.status(403).json({
          message: "You must be logged in to perform this function"
        });
      }
    })
    .catch(err => {
      res.status(403).json({
        message: "Could not update headline",
        error: err
      });
    });
};
