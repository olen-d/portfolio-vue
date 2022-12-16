// Models
const createSkill = require("../models/createSkill");

const readSkills = require("../models/readSkills");
const readSkillById = require("../models/readSkillById");
const readSkillsSorted = require("../models/readSkillsSorted");
const readSkillsTop = require("../models/readSkillsTop");
const readSkillsTypes = require("../models/readSkillsTypes");

const updateSkill = require("../models/updateSkill");

const deleteSkill = require("../models/deleteSkill");

// Helpers
const auth = require("../helpers/auth-module");

exports.create_skill = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const {
          userId,
          type,
          name,
          description,
          show,
          icon,
          priority
        } = req.body;

        const skillInfo = {
          userId,
          type,
          name,
          description,
          show,
          icon,
          priority: parseInt(priority)
        };

        createSkill
          .data(skillInfo)
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

exports.read_skills = (req, res) => {
  readSkills
    .data()
    .then(resolve => {
      const skillsObj = {
        skills: resolve
      };
      res.send(skillsObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.read_skills_sorted = (req, res) => {
  const skillSort = req.params.skill_sort;
  const sortFields = skillSort.split("+");

  const aggregation = new Object();

  sortFields.forEach(i => {
    aggregation[i] = 1;
  });

  readSkillsSorted
    .data(aggregation)
    .then(resolve => {
      const skillsObj = {
        skills: resolve
      };
      res.send(skillsObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.read_skills_top = (req, res) => {
  const limit = parseInt(req.params.limit);
  readSkillsTop
    .data(limit)
    .then(resolve => {
      const skillsTopObj = {
        skills: resolve
      };
      res.send(skillsTopObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.read_skills_types = (req, res) => {
  readSkillsTypes
    .data()
    .then(resolve => {
      const skillsTypesObj = {
        skillsTypes: resolve
      };
      res.send(skillsTypesObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.read_skill_by_id = (req, res) => {
  const skillId = req.params.skill_id;

  readSkillById
    .data(skillId)
    .then(resolve => {
      const skillObj = {
        skill: resolve
      };
      res.send(skillObj);
    })
    .catch(err => {
      res.json(err);
    });
};

exports.update_skill = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const { body: skillInfo, params: { skill_id: skillId }, } = req

        if ('priority' in skillInfo) { skillInfo.priority = parseInt(skillInfo.priority) }

        updateSkill
          .data(skillId, skillInfo)
          .then(resolve => {
            return res.json(resolve);
          })
          .catch(err => {
            console.log(`\n\nDB ERROR:\n${err}\n\n\n`)
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
      console.log(`\n\nERROR:\n${err}\n\n\n`)
      res.status(500).json({
        message: "Could not update skill",
        error: err
      });
    });
};

exports.delete_skill = (req, res) => {
  auth
    .checkAuth(req.headers)
    .then(response => {
      if (response.auth && response.administrator) {
        const skillId = req.body.skillId;

        deleteSkill
          .data(skillId)
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
        message: "Could not delete skill",
        error: err
      });
    });
};
