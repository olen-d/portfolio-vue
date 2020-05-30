const fetch = require("node-fetch");
// TODO: Set up the authorizations
require("dotenv").config({ path: "../../.env" });

// TODO: Move the following to .env when completed
const apiUrl = "https://www.strava.com/api";
const apiVersion = "v3";

// TODO: Move the following to actual authentication when completed
const accessToken = "7a8185ef35055627298f3d4ecc129d7735955114";
const userId = "28169480";
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
          console.log("BASE URL:", process.env.STRAVA_CLIENT_ID);
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
          console.log("REFRESH DATA:", data);
          resolve(data);
        } catch (error) {
          reject(error);
        }
      })();
    });
  };
  // If it doesn't exist, check for a refresh token
  // If there isn't a refresh token, send back to authorization
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const accessTokenResult = await getAccessToken();
        if (accessTokenResult.length > 0) {
          // Destructure the access token...
        } else {
          // Check for a refresh token
          const refreshTokenResult = await getRefreshToken();
          if (refreshTokenResult.length > 0) {
            const {
              data: [{ refreshToken }]
            } = refreshTokenResult;
            // Request an authorization token from Strava and put it in the database
          } else {
            // No refresh token; redirect to authorization
          }
        }
        const result = await fetch(`${apiUrl}/${apiVersion}/activities`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        });
        const data = await result.json();
        resolve(data);
      } catch (error) {
        reject(error);
      }
    })();
  });
};
data();
module.exports = { data };
