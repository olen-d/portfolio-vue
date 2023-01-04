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
router.get("/projects/featured/:limit", projects_controller.read_projects_featured);
router.get("/projects/id/:project_id", projects_controller.read_project_by_id);

router.put(
  "/projects/:project_id",
  imageUpload,
  projects_controller.update_project
);

router.delete("/projects/delete", projects_controller.delete_project);

module.exports = router;
