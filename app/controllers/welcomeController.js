// Models
const readWelcome = require("../models/readWelcome");
const updateHeadline = require("../models/updateHeadline");

// Get the welcome information

exports.read_welcome = (req, res) => {
  readWelcome
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
};
