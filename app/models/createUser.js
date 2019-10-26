const db = require("../config/connection");

const data = userInfo => {
  return new Promise((resolve, reject) => {
    try {
      db.users.insert(
        {
          firstName: userInfo.firstName,
          lastName: userInfo.lastName,
          email: userInfo.email,
          userName: userInfo.userName,
          password: userInfo.password,
          editor: false,
          administrator: false
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
