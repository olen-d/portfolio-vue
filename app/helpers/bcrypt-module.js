const bcrypt = require("bcryptjs");
const saltRounds = 10;

// Hash a password, on error, set login to false

const newPass = password => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.hash(password, saltRounds, (err, hash) => {
        resolve({
          status: 200,
          passwordHash: hash,
          login: true
        });
      });
    } catch (err) {
      reject({
        status: 500,
        login: false,
        error: "Internal server error. Failed to hash password."
      });
    }
  });
}

// Check the password
const checkPass = (password, passwordHash) => {
  return new Promise((resolve, reject) => {
    try {
      bcrypt.compare(password, passwordHash, (err, result) => {
        if (result) {
          resolve({
            status: 200,
            login: true
          });
        } else {
          resolve({
            status: 403,
            login: false
          });
        }
      });
    } catch (err) {
      reject({
        status: 403,
        error: "Forbidden." + err,
        login: false
      });
    }
  });
};

module.exports = {
  newPass: newPass,
  checkPass: checkPass
};
