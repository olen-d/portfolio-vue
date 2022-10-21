// Models
const { createSocialMedia } = require("../models/socialModel")
const readSocial = require("../models/readSocial");
const { response } = require("express");

exports.create_social = (req, res) => {
  const { body } = req

  // TODO: Trim all body properties
  // TODO: Sanitize all body properties
  const socialMediaInfo = body

  try {
    const result = createSocialMedia(socialMediaInfo)
    console.log(`\n\nResult:\n${JSON.stringify(result, null, 2)}`)
    res.send(200)
  } catch (error) {
    res.json(error)
  }
}

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
