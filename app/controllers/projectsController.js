// Models
const createProject = require("../models/createProject");

const readProjects = require("../models/readProjects");
const readProjectById = require("../models/readProjectById");

const updateProject = require("../models/updateProject");

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
            "You must be logged in and have administrator privileges to perform this function",
        });
      }
    })
    .catch(err => {
      res.status(403).json({
        message: "Could not create project",
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

exports.read_project_by_id = (req, res) => {
  const projectId = req.params.project_id;

  readProjectById
    .data(projectId)
    .then(resolve => {
      const projectObj = {
        project: resolve
      };
      res.send(projectObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.update_project = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const project_id = req.params.project_id;
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

        let screenshot = "";

        if (typeof req.file === "object") {
          screenshot = req.file.filename;
        } else {
          screenshot = req.body.screenshot;
        }

        const projectInfo = {
          project_id,
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

        updateProject
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
        message: "Could not update project",
        error: err
      });
    });
};
