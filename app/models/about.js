const db = require("../config/connection");

const data = (userName) => {
    return new Promise((resolve, reject) => {
      try {
        db.about.find({ userName : userName}, (err, data) => {
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
  }

module.exports = { data : data };
