const db = require("../config/connection");

exports.readOneUserByEmail = email => {
  return new Promise((resolve, reject) => {
    try {
      db.users.findOne(
        { email },
        { _id: 1, password: 1, firstName: 1, lastName: 1 },
        (error, data) => {
          if (error) {
            reject(error);
          } else {
            resolve(data);
          }
        }
      );
    } catch (error) {
      reject(error);
    }
  });
};
