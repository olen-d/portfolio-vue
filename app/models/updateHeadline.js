const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;
// TODO: Add CreatedAt and UpdatedAt fields...
const data = headlineData => {
  return new Promise((resolve, reject) => {
    try {
      const id = ObjectID(headlineData.id);
      db.welcome.update(
        {
          _id: id
        },
        {
          $set: { headline: headlineData.headline }
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
