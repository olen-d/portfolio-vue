const mongojs = require('mongojs')
const db = require("../config/connection")

const createSocialMediaLink = socialMediaInfo => {
  return new Promise((resolve, reject) => {
    try {
      const { icon, uri, order, anchor, username } = socialMediaInfo

      const data = {
        username,
        uri,
        anchor,
        icon,
        order
      }

      db.social.insert(data, (error, response) => {
        if (error) {
          resolve(error)
        } else {
          resolve(response)
        }
      })
    } catch (error) {
      reject ({
        status: 500,
        message: "Internal server error. Failed to create new social media record.",
        error
      })
    }
  })
}

const deleteSocialMediaLink = linkId => {
  return new Promise((resolve, reject) => {
    try {
      db.social.remove({ _id: mongojs.ObjectId(linkId) }, (error, doc) => {
        resolve(doc)
      })
    } catch (error) {
      reject({
        status: 500,
        message: "Internal server error. Failed to delete social media link.",
        error
      })
    }
  })
}

const readSocialMediaLinks = username => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.social.find({ username }, (err, data) => {
        resolve(data)
      });
    } catch (err) {
      reject({
        status: 500,
        login: false,
        error: "Internal server error. Failed to get user data."
      })
    }
  })
}

module.exports = { createSocialMediaLink, deleteSocialMediaLink, readSocialMediaLinks }
