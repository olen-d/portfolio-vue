const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = projectId => {
  return new Promise((resolve, reject) => {
    try {
      const id = ObjectID(projectId);
      db.projects.remove({ _id: id }, (error, response) => {
        if (error) {
          resolve(error);
        } else {
          resolve(response);
        }
      });
    } catch (err) {
      reject({
        status: 500,
        error: `Internal server error. Failed to delete project id: ${projectId}.`,
        message: err
      });
    }
  });
};

module.exports = { data: data };
