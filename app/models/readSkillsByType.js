const db = require("../config/connection");

const data = skills => {
  return new Promise((resolve, reject) => {
    try {
      db.skills.find({ $or: [skills] }, { type: 1, _id: 1 }, (err, data) => {
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
