// Models
const readSocial = require("../models/readSocial");

exports.read_social = (req, res) => {
  const userName = req.params.username;
  readSocial
    .data(userName)
    .then(resolve => {
      const socialObj = {
        social: resolve
      };
      res.send(socialObj);
    })
    .catch(err => {
      res.json(err);
    });
};
