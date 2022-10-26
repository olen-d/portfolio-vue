// Models
const { createSocialMedia, readSocialMedia } = require("../models/socialModel")

const { response } = require("express");

exports.create_social = async (req, res) => {
  const { body } = req

  // TODO: Trim all body properties
  // TODO: Sanitize all body properties
  const socialMediaInfo = body

  try {
    const result = await createSocialMedia(socialMediaInfo)
    res.json({ status: 200, result})
  } catch (error) {
    res.json(error)
  }
}

exports.read_social = (req, res) => {
  const userName = req.params.username;
  readSocialMedia(userName)
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
