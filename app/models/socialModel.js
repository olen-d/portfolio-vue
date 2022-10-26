const db = require("../config/connection");

const data = skillInfo => {
  return new Promise((resolve, reject) => {
    try {
      db.skills.insert(skillInfo, (error, response) => {
        if (error) {
          resolve(error);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      reject({
        status: 500,
        message: "Internal server error. Failed to create new skill.",
        error: err
      });
    }
  });
};

const createSocialMedia = socialMediaInfo => {
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

const readSocialMedia = username => {
  return new Promise((resolve, reject) => {
    try {
      const result = db.social.find({ username }, (err, data) => {
        resolve(data);
      });
    } catch (err) {
      reject({
        status: 500,
        login: false,
        error: "Internal server error. Failed to get user data."
      });
    }
  });
};

module.exports = { createSocialMedia, readSocialMedia }
