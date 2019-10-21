const db = require("../config/connection");

const data = skillInfo => {
  return new Promise((resolve, reject) => {
    try {
      db.skills.insert(skillInfo, (error, response) => {
        if (error) {
          resolve(error);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      reject({
        status: 500,
        message: "Internal server error. Failed to create new skill.",
        error: err
      });
    }
  });
};

module.exports = { data: data };
