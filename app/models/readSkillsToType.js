const db = require("../config/connection");

const data = () => {
  return new Promise((resolve, reject) => {
    try {
      db.skills.find({}, { _id: 1, type: 1 }, (err, data) => {
        if (err) {
          resolve({
            type: "error",
            message: "Database error. Failed to get skills.",
            error: err
          });
        } else {
          resolve(data);
        }
      });
    } catch (err) {
      reject({
        status: 500,
        login: false,
        error: "Internal server error. Failed to get skills."
      });
    }
  });
};

module.exports = { data: data };
