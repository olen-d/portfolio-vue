const db = require("../config/connection");

exports.readOneUserByEmail = email => {
  return new Promise((resolve, reject) => {
    try {
      db.users.findOne(
        { email },
        { _id: 1, password: 1, firstName: 1, lastName: 1, userName: 1 },
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

exports.readOneUserByUserName = userName => {
  return new Promise((resolve, reject) => {
    try {
      db.users.findOne(
        { userName },
        {
          _id: 1,
          password: 1,
          firstName: 1,
          lastName: 1,
          editor: 1,
          administrator: 1
        },
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

exports.updateOnePasswordByUserName = (userName, passwordHash) => {
  return new Promise((resolve, reject) => {
    try {
      // ! TODO: change this to updateOne when upgrading to official MongoDB package
      db.users.update(
        { userName },
        { $set: { password: passwordHash } },
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
