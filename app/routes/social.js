const express = require("express");
const router = express.Router();

const social_controller = require("../controllers/socialController");

router.get("/social/user/:username", social_controller.read_social);

module.exports = router;
