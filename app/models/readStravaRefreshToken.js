const db = require("../config/connection");

const data = athleteId => {
  return new Promise((resolve, reject) => {
    try {
      db.stravaRefreshTokens.find(
        { athleteId },
        { refreshToken: 1 },
        (err, data) => {
          if (err) {
            resolve({
              err,
              status: 404,
              error: "Failed to find access token for athlete."
            });
          } else {
            resolve(data);
          }
        }
      );
    } catch (err) {
      reject({
        status: 500,
        error: "Internal server error. Failed to get refresh token for athlete."
      });
    }
  });
};

module.exports = { data: data };
