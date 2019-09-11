const db = require("../config/connection");
// TODO: Add CreatedAt and UpdatedAt fields...
const data = userInfo => {
  return new Promise((resolve, reject) => {
    try {
      db.users
        .insert({
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          userName: userInfo.userName,
          password: userInfo.password,
          editor: false,
          administrator: false
        })
        .toArray((err, data) => {
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
