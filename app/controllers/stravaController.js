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

    // Prepare query parameters for the Strava API, which is paginated
    let page = 1;

    // The Strava API can return only activities after a certain date, so set that here
    const dt = new Date();
    dt.setFullYear(dt.getFullYear() - 1);
    dt.setDate(dt.getDate() - 7); // Since the graph can contain up to 371 days
    const after = dt.getTime() / 1000; // The Strava API requires an epoch timestamp

    // Setup for the API call
    let isResponse = true;
    const data = [];
    do {
      const response = await readActivities.data(accessToken, after, page);
      response.length > 0 ? data.push(...response) : (isResponse = false);
      page += 1;
    } while (isResponse);
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

// Non-CRUD Modules
exports.process_athlete_activities_rides = async (req, res) => {
  // Divide an array into quantiles and return the cut points
  const quantiles = (values, groups) => {
    const cutPoints = [];
    const percentage = 100 / groups / 100;
    const sorted = values.sort((a, b) => a - b);
    const totalValues = values.length;

    for (let i = 1; i < groups; i++) {
      let quantile = Math.floor(i * percentage * (totalValues + 1));
      cutPoints.push(sorted[quantile]);
    }
    return cutPoints;
  };

  const response = await fetch(
    `${process.env.API_BASE_URL}/api/strava/read/activities`
  );
  const activities = await response.json();

  // const gearId = "b4574947"; // TODO: This will be a variable later to filter by gear.
  // // const gearId = "b4868209";
  // const activitiesGear = activities.filter(activity => {
  //   return activity.gear_id === gearId;
  // });
  const rides = activities.filter(activity => {
    return activity.type === "Ride";
  });

  const processed = rides.map(activity => {
    const {
      name,
      distance,
      moving_time: movingTime,
      total_elevation_gain: totalElevationGain,
      type,
      start_date: startDate,
      gear_id: gearId,
      average_speed: averageSpeed,
      max_speed: maxSpeed,
      suffer_score: sufferScore
    } = activity;

    let startDateOnly = startDate.split("T")[0];
    const sufferScoreProcessed = sufferScore === undefined ? 0 : sufferScore // Substitute a zero when a suffer score is not provided

    const activityObj = {
      name,
      distance,
      movingTime,
      totalElevationGain,
      type,
      startDate,
      startDateOnly,
      gearId,
      averageSpeed,
      maxSpeed,
      sufferScore: sufferScoreProcessed
    };
    return activityObj;
  });

  // Group the activities by date
  const groupedByDate = processed.reduce((activitiesByDate, activity) => {
    const {
      startDateOnly,
      distance,
      movingTime,
      totalElevationGain: elevationGain,
      sufferScore
    } = activity;

    let index = activitiesByDate.length - 1;
    if (
      index > -1 &&
      activitiesByDate[index]["startDateOnly"] === startDateOnly
    ) {
      activitiesByDate[index]["distance"] += distance;
      activitiesByDate[index]["movingTime"] += movingTime;
      activitiesByDate[index]["elevationGain"] += elevationGain;
      activitiesByDate[index]["sufferScore"] += sufferScore;
      activitiesByDate[index]["activities"] += 1;
    } else {
      activitiesByDate.push({
        startDateOnly,
        distance,
        movingTime,
        elevationGain,
        sufferScore,
        activities: 1
      });
    }
    return activitiesByDate;
  }, []);

  // Calculate the average speed for each date
  const groupedByDateAvgSpeed = groupedByDate.map(activity => {
    const { distance, movingTime } = activity;
    const averageSpeed = distance / movingTime;
    return { ...activity, averageSpeed };
  });

  const distances = groupedByDate.map(activity => {
    return activity.distance;
  });

  const movingTimes = groupedByDate.map(activity => {
    return activity.movingTime;
  });

  const elevationGains = groupedByDate.map(activity => {
    return activity.elevationGain;
  });

  const sufferScores = groupedByDate.map(activity => {
    return activity.sufferScore;
  });

  const averageSpeeds = groupedByDateAvgSpeed.map(activity => {
    return activity.averageSpeed;
  });

  const activitiesDaily = groupedByDate.map(activity => {
    return activity.activities;
  });

  const distanceQuantiles = quantiles(distances, 5);
  const movingTimeQuantiles = quantiles(movingTimes, 5);
  const elevationGainQuantiles = quantiles(elevationGains, 5);
  const sufferScoreQuantiles = quantiles(sufferScores, 5);
  const averageSpeedQuantiles = quantiles(averageSpeeds, 5);

  const groupedWithQuantiles = groupedByDateAvgSpeed.map(activity => {
    const {
      distance,
      movingTime,
      elevationGain,
      sufferScore,
      averageSpeed
    } = activity;

    let distanceQuantile = null;
    let movingTimeQuantile = null;
    let elevationGainQuantile = null;
    let sufferScoreQuantile = null;
    let averageSpeedQuantile = null;

    if (distance < distanceQuantiles[0]) {
      distanceQuantile = "distance-quantile-1";
    } else if (distance < distanceQuantiles[1]) {
      distanceQuantile = "distance-quantile-2";
    } else if (distance < distanceQuantiles[2]) {
      distanceQuantile = "distance-quantile-3";
    } else if (distance < distanceQuantiles[3]) {
      distanceQuantile = "distance-quantile-4";
    } else {
      distanceQuantile = "distance-quantile-5";
    }

    if (movingTime < movingTimeQuantiles[0]) {
      movingTimeQuantile = "moving-time-quantile-1";
    } else if (movingTime < movingTimeQuantiles[1]) {
      movingTimeQuantile = "moving-time-quantile-2";
    } else if (movingTime < movingTimeQuantiles[2]) {
      movingTimeQuantile = "moving-time-quantile-3";
    } else if (movingTime < movingTimeQuantiles[3]) {
      movingTimeQuantile = "moving-time-quantile-4";
    } else {
      movingTimeQuantile = "moving-time-quantile-5";
    }

    if (elevationGain < elevationGainQuantiles[0]) {
      elevationGainQuantile = "elevation-gain-quantile-1";
    } else if (elevationGain < elevationGainQuantiles[1]) {
      elevationGainQuantile = "elevation-gain-quantile-2";
    } else if (elevationGain < elevationGainQuantiles[2]) {
      elevationGainQuantile = "elevation-gain-quantile-3";
    } else if (elevationGain < elevationGainQuantiles[3]) {
      elevationGainQuantile = "elevation-gain-quantile-4";
    } else {
      elevationGainQuantile = "elevation-gain-quantile-5";
    }

    if (sufferScore < sufferScoreQuantiles[0]) {
      sufferScoreQuantile = "suffer-score-quantile-1";
    } else if (sufferScore < sufferScoreQuantiles[1]) {
      sufferScoreQuantile = "suffer-score-quantile-2";
    } else if (sufferScore < sufferScoreQuantiles[2]) {
      sufferScoreQuantile = "suffer-score-quantile-3";
    } else if (sufferScore < sufferScoreQuantiles[3]) {
      sufferScoreQuantile = "suffer-score-quantile-4";
    } else {
      sufferScoreQuantile = "suffer-score-quantile-5";
    }

    if (averageSpeed < averageSpeedQuantiles[0]) {
      averageSpeedQuantile = "average-speed-quantile-1";
    } else if (averageSpeed < averageSpeedQuantiles[1]) {
      averageSpeedQuantile = "average-speed-quantile-2";
    } else if (averageSpeed < averageSpeedQuantiles[2]) {
      averageSpeedQuantile = "average-speed-quantile-3";
    } else if (averageSpeed < averageSpeedQuantiles[3]) {
      averageSpeedQuantile = "average-speed-quantile-4";
    } else {
      averageSpeedQuantile = "average-speed-quantile-5";
    }

    const activityObj = {
      ...activity,
      distanceQuantile,
      movingTimeQuantile,
      elevationGainQuantile,
      sufferScoreQuantile,
      averageSpeedQuantile
    };
    return activityObj;
  });

  res.json({ data: groupedWithQuantiles });
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
