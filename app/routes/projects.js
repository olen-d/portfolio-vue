const express = require("express");
const router = express.Router();

// Middleware
const multer = require("multer");

// Set Storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/assets/images");
  }, // TODO - FIX THIS TO FILTER FOR IMAGE FILES
  filename: (req, file, cb) => {
    cb(null, "fsf" + "-" + Date.now() + "-" + file.originalname);
  }
});
const upload = multer({ storage: storage });

const projects_controller = require("../controllers/projectsController");

router.post(
  "/projects/create",
  upload.single("file"),
  projects_controller.create_project
);

router.get("/projects", projects_controller.read_projects);

module.exports = router;
