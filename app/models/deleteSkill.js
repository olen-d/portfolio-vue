const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = skillId => {
  return new Promise((resolve, reject) => {
    try {
      const id = ObjectID(skillId);
      db.skills.remove({ _id: id }, (error, response) => {
        if (error) {
          resolve(error);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      reject({
        status: 500,
        error: `Internal server error. Failed to delete skill id: ${skillId}.`,
        message: err
      });
    }
  });
};

module.exports = { data: data };
