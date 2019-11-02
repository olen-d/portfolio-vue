const db = require("../config/connection");

const data = () => {
  return new Promise((resolve, reject) => {
    try {
      db.skills.distinct(
        "type",
        () => {}, // Blank callback function, remove when switching from Mongojs
        (err, data) => {
          resolve(data);
        }
      );
    } catch (err) {
      reject({
        err,
        status: 500,
        error: "Internal server error. Failed to get skills types data."
      });
    }
  });
};

module.exports = { data: data };
