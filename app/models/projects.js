const db = require("../config/connection");

const data = () => {
    return new Promise((resolve, reject) => {
      try {
        db.projects.find({ show : 1 }, (err, data) => {
            resolve(data);
        });
      } catch (err) {
        reject({
          status: 500,
          login: false,
          error: "Internal server error. Failed to get projects."
        });
      }
    });
  }

module.exports = { data : data };
