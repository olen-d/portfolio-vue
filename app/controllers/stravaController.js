const fetch = require("node-fetch");

// Models
const createStravaAccessToken = require("../models/createStravaAccessToken");
const createStravaRefreshToken = require("../models/createStravaRefreshToken");
const readStravaAccessToken = require("../models/readStravaAccessToken");
const readStravaRefreshToken = require("../models/readStravaRefreshToken");

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

exports.read_refresh_token = (req, res) => {
  const athleteId = parseInt(process.env.STRAVA_ATHLETE_ID);
  (async () => {
    const data = await readStravaRefreshToken.data(athleteId);

    res.json({ data });
  })();
};

exports.read_refresh_access_token = (req, res) => {
  console.log("PARAMS", req.params);
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

// Helpers
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
