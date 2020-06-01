const fetch = require("node-fetch");
// TODO: Set up the authorizations
require("dotenv").config({ path: "../../.env" });

// TODO: Move the following to .env when completed
const apiUrl = "https://www.strava.com/api";
const apiVersion = "v3";

// TODO: Fix this global later
let gblAccessToken = "";

// Models
const updateStravaAccessToken = require("./updateStravaAccessToken");
const updateStravaRefreshToken = require("./updateStravaRefreshToken");
// TODO: Move the following to actual authentication when completed
// const accessToken = "7a8185ef35055627298f3d4ecc129d7735955114";
// const userId = "28169480";
//athletes/28169480/?access_token=f9f9e7f478036ec67f20631640efb81508067d5b
// `${apiUrl}/${apiVersion}/athletes/${userId}/?access_token=${accessToken}`
// Get the access token
// const fetchAccessToken = () => {
//   return new Promise((resolve, reject) => {
//     //
//   });
// };

// Access the Strava API
const data = () => {
  // Get an access
  const getAccessToken = () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await fetch(
            `${process.env.API_BASE_URL}/api/strava/read/accesstoken`
          );
          const data = await result.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  };

  const getRefreshToken = () => {
    return new Promise((resolve, reject) => {
      (async () => {
        try {
          const result = await fetch(
            `${process.env.API_BASE_URL}/api/strava/read/refreshtoken`
          );
          const data = await result.json();
          resolve(data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  };
  // If it doesn't exist, check for a refresh token
  // If there isn't a refresh token, send back to authorization
  // TODO: Pull this out - it probably shouldn't be a part of the model, a token should be passed to the model
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const accessTokenResult = await getAccessToken();
        if (accessTokenResult.data && accessTokenResult.data.length > 0) {
          // Destructure the access token...
          const {
            data: [{ accessToken: at }]
          } = accessTokenResult;
          gblAccessToken = at;
        } else {
          // Check for a refresh token
          const refreshTokenResult = await getRefreshToken();
          if (refreshTokenResult.data && refreshTokenResult.data.length > 0) {
            const {
              data: [{ refreshToken }]
            } = refreshTokenResult;
            // Request an authorization token from Strava and put it in the database
            const result = await fetch(
              `${
                process.env.API_BASE_URL
              }/api/strava/read/refresh/accesstoken/${refreshToken}`
            );
            // console.log("REFRESH TOKEN RESULT", result);

            const data = await result.json();
            const {
              data: {
                access_token: accessToken,
                expires_at: expiresAt,
                refresh_token: newRefreshToken
              }
            } = data;
            // TODO: Consider abstracting this into an API route
            gblAccessToken = accessToken;
            const athleteId = parseInt(process.env.STRAVA_ATHLETE_ID);
            const updateAccessTokenResult = await updateStravaAccessToken.data(
              athleteId,
              accessToken,
              expiresAt
            );
            // TODO: Consider abstracting this into an API route
            const updateRefreshTokenResult = await updateStravaRefreshToken.data(
              athleteId,
              newRefreshToken
            );
          } else {
            // No refresh token; redirect to authorization
          }
        }
        const result = await fetch(`${apiUrl}/${apiVersion}/activities`, {
          headers: {
            Authorization: `Bearer ${gblAccessToken}`
          }
        });
        const data = await result.json();
        console.log("DATA:", data);
        resolve(data);
      } catch (error) {
        reject(error);
      }
    })();
  });
};
data();
module.exports = { data };
