const db = require("../config/connection");

const data = skillType => {
  return new Promise((resolve, reject) => {
    try {
      db.skills.find({ type: skillType }, { name: 1 }, (err, data) => {
        resolve(data);
      });
    } catch (err) {
      reject({
        status: 500,
        error: `Internal server error. Failed to get names for the skill: ${skillType}.`
      });
    }
  });
};

module.exports = { data: data };
