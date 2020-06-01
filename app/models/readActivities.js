const fetch = require("node-fetch");

require("dotenv").config({ path: "../../.env" });

const apiUrl = process.env.STRAVA_API_URL;
const apiVersion = process.env.STRAVA_API_VERSION;

const data = accessToken => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
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

module.exports = { data };
