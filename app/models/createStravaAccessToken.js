const db = require("../config/connection");

const data = (athleteId, scope, accessToken, expiresAt) => {
  const doc = {
    athleteId,
    scope,
    accessToken,
    expiresAt
  };

  return new Promise((resolve, reject) => {
    try {
      db.stravaAccessTokens.insert(doc, (error, response) => {
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
          "Internal server error. Failed to create new Strava access token.",
        error: err
      });
    }
  });
};

module.exports = { data: data };
