const db = require("../config/connection");
// TODO: Add CreatedAt and UpdatedAt fields...
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
        error: `Internal server error. Failed to create new skill.\n${err}`
      });
    }
  });
};

module.exports = { data: data };
