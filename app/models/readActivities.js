const fetch = require("node-fetch");

require("dotenv").config({ path: "../../.env" });

const apiUrl = process.env.STRAVA_API_URL;
const apiVersion = process.env.STRAVA_API_VERSION;

const data = (accessToken, after, page) => {
  return new Promise((resolve, reject) => {
    (async () => {
      try {
        const result = await fetch(`${apiUrl}/${apiVersion}/activities?after=${after}&page=${page}&per_page=200`, {
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
