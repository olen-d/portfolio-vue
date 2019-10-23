const db = require("../config/connection");

const data = () => {
  return new Promise((resolve, reject) => {
    try {
      db.skills
        .find()
        .sort({ type: 1, priority: 1 })
        .toArray((err, data) => {
          resolve(data);
        });
    } catch (err) {
      reject({
        status: 500,
        error: "Internal server error. Failed to get skills data."
      });
    }
  });
};

module.exports = { data: data };
