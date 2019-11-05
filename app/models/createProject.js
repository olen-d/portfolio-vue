const db = require("../config/connection");

const data = projectInfo => {
  return new Promise((resolve, reject) => {
    try {
      db.projects.insert(projectInfo, (error, response) => {
        if (error) {
          resolve(error);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      reject({
        status: 500,
        message: "Internal server error. Failed to create new project.",
        error: err
      });
    }
  });
};

module.exports = { data: data };
