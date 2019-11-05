// Models
const createProject = require("../models/createProject");
const readProjects = require("../models/readProjects");

// Middleware
const multer = require("multer");

// Helpers
const auth = require("../helpers/auth-module");

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

(exports.create_project = upload.single("file")),
  (req, res) => {
    auth
      .checkAuth(req.headers)
      .then(response => {
        if (response.auth && response.administrator) {
          console.log(req.body);
        } else {
          // Not Authorized
        }
      })
      .catch(err => {
        // Err
      });
  };

exports.read_projects = (req, res) => {
  readProjects
    .data()
    .then(resolve => {
      const projectsObj = {
        projects: resolve
      };
      res.send(projectsObj);
    })
    .catch(err => {
      res.json(err);
    });
};
