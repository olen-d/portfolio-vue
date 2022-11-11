const db = require("../config/connection");

const data = username => {
  return new Promise((resolve, reject) => {
    try {
      db.users.findOne({ username }, (err, data) => {
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

module.exports = { data: data };
