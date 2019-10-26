// Models

const readOneProfile = require("../models/readOneProfile");

exports.read_one_profile = (req, res) => {
  let userName = req.params.username;
  readOneProfile
    .data(userName)
    .then(resolve => {
      // TODO: Delete user password
      const userObj = {
        profile: resolve
      };
      res.send(userObj);
    })
    .catch(err => {
      res.json(err);
    });
};
