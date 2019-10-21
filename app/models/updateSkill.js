const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = skillInfo => {
  return new Promise((resolve, reject) => {
    try {
      const {
        skill_id,
        userId,
        type,
        name,
        description,
        show,
        icon,
        priority
      } = skillInfo;
      const id = ObjectID(skill_id);
      const now = Date.now();

      db.skills.update(
        {
          _id: id
        },
        {
          $set: {
            userId: userId,
            type: type,
            name: name,
            description: description,
            show: show,
            icon: icon,
            priority: priority,
            updatedAt: now
          }
        },
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
