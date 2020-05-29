const db = require("../config/connection");

const data = athleteId => {
  return new Promise((resolve, reject) => {
    try {
      const currentTimestamp = Math.floor(Date.now() / 1000);
      db.stravaAccessTokens.find(
        { athleteId, expiresAt: { $gt: currentTimestamp } },
        { accessToken: 1 },
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
        error: "Internal server error. Failed to get access token for athlete."
      });
    }
  });
};

module.exports = { data: data };
