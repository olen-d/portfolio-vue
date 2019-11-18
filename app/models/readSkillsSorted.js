const db = require("../config/connection");

const data = aggregation => {
  return new Promise((resolve, reject) => {
    try {
      db.skills
        .find()
        .sort(aggregation)
        .toArray((err, data) => {
          if (err) {
            resolve(err);
          } else {
            resolve(data);
          }
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
