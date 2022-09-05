const express = require("express");
const router = express.Router();

const welcome_controller = require("../controllers/welcomeController");

router.get("/welcome", welcome_controller.read_welcome);
router.post("/welcome/headline", welcome_controller.create_headline);
router.put(
  "/welcome/update/headline/:headline_id",
  welcome_controller.update_headline
);

module.exports = router;
