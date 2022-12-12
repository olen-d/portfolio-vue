const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = (projectId, projectInfo) => {
  return new Promise((resolve, reject) => {
    try {
      const projectInfoProcessed = { $set: {} }
      const projectInfoObjId = ObjectID(projectId)

      for (const key of Object.keys(projectInfo)) {
        projectInfoProcessed.$set[key] = projectInfo[key]
      }

      const now = Date.now();
      projectInfoProcessed.$set.updatedAt = now

      const filter = { _id: projectInfoObjId }
      const updateDoc = projectInfoProcessed

      // db.collection('projects').updateOne(filter, updateDoc)

      db.projects.update(
        filter,
        updateDoc,
        (error, response) => {
          if (error) {
            resolve(error);
          } else {
            resolve(response);
          }
        }
      );
    } catch (err) {
      reject({
        status: 500,
        message: "Internal server error. Failed to update project.",
        error: err
      });
    }
  });
};

module.exports = { data: data };
