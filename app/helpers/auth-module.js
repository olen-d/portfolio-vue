const jwt = require("jsonwebtoken");

const checkAuth = headers => {
  // Check the user token
  return new Promise((res, rej) => {
    try {
      let token = headers["x-access-token"] || headers["authorization"];

      if (token.startsWith("Bearer ")) {
        token = token.slice(7, token.length);
      }

      if (token) {
        jwt.verify(token, process.env.secret, (err, decoded) => {
          if (err) {
            //fail
            console.log("Token Verification Failed");
          } else {
            console.log("DECODED\n",decoded);
            // Return the auth ok.
            res({
              auth: true
            });
          }
        });
      } else {
        //no token
      }
    } catch (err) {
      rej({
        auth: false,
        error: "Internal server error. Failed to authenticate request"
      });
    }
  });
};

module.exports = {
  checkAuth: checkAuth
};
