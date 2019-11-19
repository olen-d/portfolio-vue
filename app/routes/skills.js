const express = require("express");
const router = express.Router();

const skills_controller = require("../controllers/skillsController");

router.post("/skills/create", skills_controller.create_skill);

router.get("/skills", skills_controller.read_skills);
router.get("/skills/sort/:skill_sort", skills_controller.read_skills_sorted);
router.get(
  "/skills/names/:skill_type",
  skills_controller.read_skill_names_by_type
);
router.get("/skills/to/type", skills_controller.read_skills_to_type); // probably delete this
router.get("/skills/top/:limit", skills_controller.read_skills_top);
router.get("/skills/types", skills_controller.read_skills_types);
router.get("/skills/id/:skill_id", skills_controller.read_skill_by_id);

router.put("/skills/update/:skill_id", skills_controller.update_skill);

router.delete("/skills/delete", skills_controller.delete_skill);

module.exports = router;
