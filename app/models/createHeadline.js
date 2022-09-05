const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = headlineInfo => {
  return new Promise((resolve, reject) => {
    const { userId, headline } = headlineInfo;
    const createdBy = ObjectID(userId);
    try {
      db.welcome.insert(
        {
          createdBy,
          headline,
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
        error: "Internal server error. Failed to create new headline."
      });
    }
  });
};

module.exports = { data };
