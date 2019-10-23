const db = require("../config/connection");

const data = () => {
  return new Promise((resolve, reject) => {
    try {
      db.projects.find((err, data) => {
        if (err) {
          resolve({
            type: "error",
            message: "Database error. Failed to get projects.",
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
        error: "Internal server error. Failed to get projects."
      });
    }
  });
};

module.exports = { data: data };
