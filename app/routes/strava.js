const express = require("express");
const router = express.Router();

const strava_controller = require("../controllers/stravaController");

router.get("/strava", strava_controller.read_auth_code);
router.get("/strava/read/accesstoken", strava_controller.read_access_token);

// TODO: UPDATE THIS ROUTE TO BE /STRAVA/RESPONSE/AUTHCODE
module.exports = router;
