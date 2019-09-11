const db = require("../config/connection");

const data = limit => {
  return new Promise((resolve, reject) => {
    try {
      db.skills
        .find({ show: 1 })
        .sort({ priority: 1 })
        .limit(limit)
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
