const db = require("../config/connection");

const data = (athleteId, accessToken, expiresAt) => {
  console.log("MODEL AT:", athleteId, accessToken, expiresAt);
  return new Promise((resolve, reject) => {
    try {
      db.stravaAccessTokens.update(
        { athleteId },
        { $set: { accessToken, expiresAt } },
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
        message: "Internal server error. Failed to update Strava access token.",
        error: err
      });
    }
  });
};

module.exports = { data: data };
