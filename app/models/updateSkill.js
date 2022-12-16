const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = (skillId, skillInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const skillInfoProcessed = { $set: {} }
      const skillInfoObjId = ObjectID(skillId)

      for (const key of Object.keys(skillInfo)) {
        skillInfoProcessed.$set[key] = skillInfo[key]
      }

      const now = Date.now();
      skillInfoProcessed.$set.updatedAt = now

      const filter = { _id: skillInfoObjId }
      const updateDoc = skillInfoProcessed

      db.skills.update(
        filter,
        updateDoc,
        (error, response) => {
          if (error) {
            resolve(error);
          } else {
            resolve(response);
          }
        }
      );
    } catch (err) {
      reject({
        status: 500,
        message: "Internal server error. Failed to update skill.",
        error: err
      });
    }
  });
};

module.exports = { data: data };
