const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;
// TODO: Add CreatedAt and UpdatedAt fields...
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
            priority: priority
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
        error: "Internal server error. Failed to create new user."
      });
    }
  });
};

module.exports = { data: data };
