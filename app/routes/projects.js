const express = require("express");
const router = express.Router();

const projects_controller = require("../controllers/projectsController");

router.get("/projects", projects_controller.read_projects);

module.exports = router;
