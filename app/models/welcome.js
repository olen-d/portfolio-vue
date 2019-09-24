const db = require("../config/connection");

const data = () => {
  return new Promise((resolve, reject) => {
    try {
      db.welcome.find({}, { headline: 1 }, (err, data) => {
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
};

module.exports = { data: data };
