const fetch = require("node-fetch");
// TODO: Refactor self executing async functions up to exports.. (req, res) => wherever it makes sense
// Models
const createStravaAccessToken = require("../models/createStravaAccessToken");
const createStravaRefreshToken = require("../models/createStravaRefreshToken");
const readActivities = require("../models/readActivities");
const readStravaAccessToken = require("../models/readStravaAccessToken");
const readStravaRefreshToken = require("../models/readStravaRefreshToken");
const updateStravaAccessToken = require("../models/updateStravaAccessToken");
const updateStravaRefreshToken = require("../models/updateStravaRefreshToken");

exports.read_auth_code = (req, res) => {
  if (req.query) {
    if (req.query.error) {
      //TODO: Deal with the error
      res.write(`<p>ERROR:</p><p></p>${req.query.error}`);
    } else {
      const {
        query: { code, scope, state }
      } = req;
      res.write(`<p>${code}, ${scope}, ${state}`);

      const scopes = scope.split(",");
      if (scopes.indexOf("activity:read") !== -1) {
        res.write("<p>Activity Read Found...</p>");
        (async () => {
          const formData = {
            client_id: process.env.STRAVA_CLIENT_ID,
            client_secret: process.env.STRAVA_CLIENT_SECRET,
            code,
            grant_type: "authorization_code"
          };

          const result = await fetch(`${process.env.STRAVA_TOKEN_URI}`, {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          });
          const data = await result.json();

          const {
            access_token: accessToken,
            expires_at: expiresAt,
            refresh_token: refreshToken,
            athlete: { id: athleteId }
          } = data;
          // TODO: Consider abstracting this into an API route (also in: readActivities.js)
          const createAccessTokenResult = await createStravaAccessToken.data(
            athleteId,
            scope,
            accessToken,
            expiresAt
          );
          // TODO: Consider abstracting this into an API route (also in: readActivities.js)
          const createRefreshTokenResult = await createStravaRefreshToken.data(
            athleteId,
            scope,
            refreshToken
          );

          res.write(`<p>CREATE TOKEN RESULT: </p><p>${JSON.stringify(createAccessTokenResult)}</p>`);
          res.write(`<p>REFRESH TOKEN RESULT:<p>${JSON.stringify(createRefreshTokenResult)}</p>`);
          const cheese = JSON.stringify(data);
          res.write(`<p>DATA:</p><p>${cheese}</p>`);
        })();
      } else {
        res.write(
          "<p>Permission to view data about your activities is required. </p>"
        );
        // Send back to Oauth after a set time. Or include a retry button.
      }
    }
  } else {
    // TODO: Failed, deal with error.
    res.write("FAIL");
  }
};

exports.read_access_token = (req, res) => {
  const athleteId = parseInt(process.env.STRAVA_ATHLETE_ID);
  (async () => {
    const data = await readStravaAccessToken.data(athleteId);

    res.json({ data });
  })();
};

exports.read_activities = (req, res) => {
  (async () => {
    let accessToken = "";

    const accessTokenResult = await getAccessToken();
    if (accessTokenResult.data && accessTokenResult.data.length > 0) {
      const {
        data: [{ accessToken: at }]
      } = accessTokenResult;
      accessToken = at;
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
        const data = await result.json();
        const {
          data: {
            access_token: at,
            expires_at: expiresAt,
            refresh_token: newRefreshToken
          }
        } = data;
        // TODO: Consider abstracting this into an API route
        accessToken = at;
        const athleteId = parseInt(process.env.STRAVA_ATHLETE_ID);
        const formData = {
          athleteId,
          accessToken,
          expiresAt
        };

        // Update the access token in the database
        const updateAccessTokenResult = await fetch(
          `${process.env.API_BASE_URL}/api/strava/update/accesstoken`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          }
        );
        const updateAccessTokenData = await updateAccessTokenResult.json();

        if (updateAccessTokenData.response.ok !== 1) {
          // TODO: Deal with the error. Probably just log it, Strava will return the token with a refresh request anyway
        }

        // The access token response came with a refresh token, so update that too
        const formDataRefresh = {
          athleteId,
          newRefreshToken
        };

        const updateRefreshTokenResult = await fetch(
          `${process.env.API_BASE_URL}/api/strava/update/refreshtoken`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formDataRefresh)
          }
        );
        const updateRefreshTokenData = await updateRefreshTokenResult.json();

        if (updateRefreshTokenData.response.ok !== 1) {
          // TODO: Deal with the error
        }
      } else {
        // No refresh token; TODO: redirect to authorization
      }
    }
    const data = await readActivities.data(accessToken);
    res.json(data);
  })();
};

exports.read_refresh_token = (req, res) => {
  const athleteId = parseInt(process.env.STRAVA_ATHLETE_ID);
  (async () => {
    const data = await readStravaRefreshToken.data(athleteId);

    res.json({ data });
  })();
};

// Get a new access token from strava using the refresh token
exports.read_refresh_access_token = (req, res) => {
  const { refreshtoken } = req.params;
  (async () => {
    try {
      // eslint-disable-next-line prettier/prettier
      const data = await getStravaAccessToken(refreshtoken, "refresh_token");
      res.json({ data });
    } catch (error) {
      res.json({ error });
    }
  })();
};

// Update Modules
exports.update_access_token = async (req, res) => {
  const { athleteId, accessToken, expiresAt } = req.body;
  try {
    const result = await updateStravaAccessToken.data(
      athleteId,
      accessToken,
      expiresAt
    );
    res.json({ ...result });
  } catch (error) {
    res.json({ error });
  }
};

exports.update_refresh_token = async (req, res) => {
  const { athleteId, newRefreshToken } = req.body;
  try {
    const result = await updateStravaRefreshToken.data(
      athleteId,
      newRefreshToken
    );
    res.json({ ...result });
  } catch (error) {
    res.json({ error });
  }
};

// Helpers
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

const getStravaAccessToken = (code, grantType) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const formData = {
          client_id: process.env.STRAVA_CLIENT_ID,
          client_secret: process.env.STRAVA_CLIENT_SECRET,
          grant_type: grantType
        };

        // eslint-disable-next-line prettier/prettier
        grantType === "refresh_token" ? formData.refresh_token = code : formData.code = code;

        const result = await fetch(`${process.env.STRAVA_TOKEN_URI}`, {
          method: "post",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        });
        const data = await result.json();
        resolve(data);
      } catch (error) {
        reject({ error });
      }
    })();
  });
};
