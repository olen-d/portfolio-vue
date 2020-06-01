const db = require("../config/connection");

const data = (athleteId, refreshToken) => {
  return new Promise((resolve, reject) => {
    try {
      db.stravaRefreshTokens.update(
        { athleteId },
        { $set: { refreshToken } },
        (error, response) => {
          if (error) {
            resolve({ error });
          } else {
            resolve({ response });
          }
        }
      );
    } catch (err) {
      reject({
        status: 500,
        message: "Internal server error. Failed to update Strava access token.",
        error: err
      });
    }
  });
};

module.exports = { data: data };
