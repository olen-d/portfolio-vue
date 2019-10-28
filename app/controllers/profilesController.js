// Models
const readOneProfile = require("../models/readOneProfile");
const readProfileContact = require("../models/readOneProfileContact");

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

exports.read_one_profile_contact = (req, res) => {
  let userName = req.params.username;
  readProfileContact
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
};
