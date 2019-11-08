// Models
const createProject = require("../models/createProject");
const readProjects = require("../models/readProjects");

// Helpers
const auth = require("../helpers/auth-module");

exports.create_project = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const {
          userId,
          title,
          description,
          deployedLink,
          repoLink,
          skills,
          priority,
          show
        } = req.body;

        const screenshot = req.file.filename;

        const projectInfo = {
          userId,
          title,
          description,
          deployedLink,
          repoLink,
          screenshot,
          skills: JSON.parse(skills),
          priority: parseInt(priority),
          show: parseInt(show)
        };

        createProject
          .data(projectInfo)
          .then(response => {
            res.json(response);
          })
          .catch(err => {
            res.status(500).json({
              message: "Internal server error",
              error: err
            });
          });
      } else {
        res.status(403).json({
          type: "error",
          message:
            "You must be logged in and have administrator privileges to perform this function"
        });
      }
    })
    .catch(err => {
      res.status(403).json({
        message: "Could not create skill",
        error: err
      });
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
