const db = require("../config/connection");

const data = (userName) => {
    return new Promise((resolve, reject) => {
      try {
        db.about.find({ userName : userName}, { address: 1, city: 1, email: 1, state: 1, tel: 1, zip: 1}, (err, data) => {
            resolve(data);
        });
      } catch (err) {
        reject({
          status: 500,
          login: false,
          error: "Internal server error. Failed to get user contact information."
        });
      }
    });
  }

module.exports = { data : data };
