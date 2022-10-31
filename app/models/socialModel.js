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

const updateSocialMediaLink = (linkId, data) => {
  return new Promise((resolve, reject) => {
    try {
      const dataProcessed = { $set: {} }

      for (const key of Object.keys(data)) {
        dataProcessed.$set[key] = data[key]
      }

      const filter = { _id: mongojs.ObjectId(linkId) }
      const updateDoc = dataProcessed

      db.collection('social').update(filter, updateDoc, (error, doc) => {
        if (error) {
          resolve({ status: 500, error })
        } else {
          resolve({status: 204, data: doc })
        }
      })
    } catch (error) {
      reject({ status: 500, error })
    }
  })
}

module.exports = { createSocialMediaLink, deleteSocialMediaLink, readSocialMediaLinks, updateSocialMediaLink }
