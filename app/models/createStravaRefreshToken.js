const db = require("../config/connection");

const data = (athleteId, scope, refreshToken) => {
  const doc = {
    athleteId,
    scope,
    refreshToken
  };

  return new Promise((resolve, reject) => {
    try {
      db.stravaRefreshTokens.insert(doc, (error, response) => {
        if (error) {
          resolve(error);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      reject({
        status: 500,
        message:
          "Internal server error. Failed to create new Strava refresh token.",
        error: err
      });
    }
  });
};

module.exports = { data: data };
