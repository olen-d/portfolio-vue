const fetch = require("node-fetch");
// TODO: Set up the authorizations

// TODO: Move the following to .env when completed
const apiUrl = "https://www.strava.com/api";
const apiVersion = "v3";

// TODO: Move the following to actual authentication when completed
const accessToken = "f9f9e7f478036ec67f20631640efb81508067d5b";
const userId = "28169480";
//athletes/28169480/?access_token=f9f9e7f478036ec67f20631640efb81508067d5b

// Access the Strava API
const fetchActivities = () => {
  return new Promise((resolve, reject) => {
    fetch(
      `${apiUrl}/${apiVersion}/athletes/${userId}/?access_token=${accessToken}`
    )
      .then(data => {
        data.json().then(json => {
          resolve(json);
        });
      })
      .catch(error => {
        reject(error);
      });
  });
};

const data = () => {
  fetchActivities().then(response => {
    console.log(response);
  });
};

data();

module.exports = { data };
