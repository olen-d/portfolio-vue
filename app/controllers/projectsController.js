// Models
const createProject = require("../models/createProject");

const readProjects = require("../models/readProjects");
const readProjectById = require("../models/readProjectById");

const updateProject = require("../models/updateProject");

const deleteProject = require("../models/deleteProject");

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
          show
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
      res.status(500).json({
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
        const { body: projectInfo, params: { project_id: projectId }, } = req

        if ('priority' in projectInfo) { projectInfo.priority = parseInt(projectInfo.priority) }
        if ('skills' in projectInfo) { projectInfo.skills = JSON.parse(projectInfo.skills) }

        updateProject
          .data(projectId, projectInfo)
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

exports.delete_project = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const projectId = req.body.projectId;

        deleteProject
          .data(projectId)
          .then(resolve => {
            return res.json(resolve);
          })
          .catch(err => {
            return res.json(err);
          });
      } else {
        res.status(403).json({
          message: "You must be logged in to perform this function"
        });
      }
    })
    .catch(err => {
      res.status(403).json({
        message: "Could not delete project",
        error: err
      });
    });
};
