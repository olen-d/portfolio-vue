const jwt = require("jsonwebtoken");

const checkAuth = headers => {
  // Check the user token
  return new Promise((resolve, reject) => {
    try {
      let token = headers["x-access-token"] || headers["authorization"];

      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }

      if (token) {
        jwt.verify(token, process.env.secret, (err, decoded) => {
          if (err) {
            resolve({
              auth: false
            });
          } else {
            resolve({
              auth: true,
              editor: decoded.editor,
              administrator: decoded.administrator
            });
          }
        });
      } else {
        //no token
      }
    } catch (err) {
      reject({
        auth: false,
        error: "Internal server error. Failed to authenticate request"
      });
    }
  });
};

module.exports = {
  checkAuth: checkAuth
};
