const db = require("../config/connection");
const ObjectID = require("mongodb").ObjectID;

const data = projectInfo => {
  return new Promise((resolve, reject) => {
    try {
      const {
        project_id,
        userId,
        title,
        description,
        deployedLink,
        repoLink,
        screenshot,
        skills,
        priority,
        show
      } = projectInfo;
      const id = ObjectID(project_id);
      const now = Date.now();

      db.projects.update(
        {
          _id: id
        },
        {
          $set: {
            userId,
            title,
            description,
            deployedLink,
            repoLink,
            screenshot,
            skills,
            priority,
            show,
            updatedAt: now
          }
        },
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
