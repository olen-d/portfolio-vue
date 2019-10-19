const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = skillId => {
  return new Promise((resolve, reject) => {
    try {
      const id = ObjectID(skillId);
      db.skills.findOne({ _id: id }, (err, data) => {
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
