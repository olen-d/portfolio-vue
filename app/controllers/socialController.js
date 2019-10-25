// Models

const readSocial = require("../models/readSocial");

// Get the social media information

exports.read_social = (req, res) => {
  const userName = req.params.username;
  readSocial
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
};
