const express = require("express");
const router = express.Router();

const imageUpload = require("../helpers/upload-image");

const projects_controller = require("../controllers/projectsController");

router.post(
  "/projects/create",
  imageUpload,
  projects_controller.create_project
);

router.get("/projects", projects_controller.read_projects);

module.exports = router;
