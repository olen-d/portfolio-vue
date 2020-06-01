const express = require("express");
const router = express.Router();

const strava_controller = require("../controllers/stravaController");

router.get("/strava", strava_controller.read_auth_code);
router.get("/strava/read/accesstoken", strava_controller.read_access_token);
router.get("/strava/read/activities", strava_controller.read_activities);
router.get(
  "/strava/read/refresh/accesstoken/:refreshtoken",
  strava_controller.read_refresh_access_token
);
router.get("/strava/read/refreshtoken", strava_controller.read_refresh_token);

// TODO: UPDATE THIS ROUTE TO BE /STRAVA/RESPONSE/AUTHCODE
module.exports = router;
