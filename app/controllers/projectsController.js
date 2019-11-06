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
        console.log("NINJAS\n", req.body);
      } else {
        // Not Authorized
        // TODO: Remove the uploaded file and kick out an error.
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
