const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = projectId => {
  return new Promise((resolve, reject) => {
    try {
      const id = ObjectID(projectId);
      db.projects.findOne({ _id: id }, (err, data) => {
        resolve(data);
      });
    } catch (err) {
      reject({
        status: 500,
        error: `Internal server error. Failed to get project data for ${projectId}.`
      });
    }
  });
};

module.exports = { data: data };
