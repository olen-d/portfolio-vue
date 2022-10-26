// Models
const { createSocialMediaLink, deleteSocialMediaLink, readSocialMediaLinks } = require("../models/socialModel")

const { response } = require("express");

exports.create_social_media_link = async (req, res) => {
  const { body } = req

  // TODO: Trim all body properties
  // TODO: Sanitize all body properties
  const socialMediaInfo = body

  try {
    const result = await createSocialMediaLink(socialMediaInfo)
    res.json({ status: 200, result})
  } catch (error) {
    res.json(error)
  }
}

exports.delete_social_media_link = async (req, res) => {
  const { params: { linkId }, } = req

  try {
    const result = await deleteSocialMediaLink(linkId)
    res.json({ status: 200, result })
  } catch (error) {
    res.json(error)
  }
}

exports.read_social_media_links = (req, res) => {
  const userName = req.params.username;
  readSocialMediaLinks(userName)
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
