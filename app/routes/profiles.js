const express = require("express");
const router = express.Router();

const profiles_controller = require("../controllers/profilesController");

router.get("/profiles/:username", profiles_controller.read_one_profile);

module.exports = router;
