<template>
  <div id="skills-types">
    <div id="skill-type" v-for="skillType in skillsTypes" :key="skillType">
      <SkillNamesbyType
        v-bind:type="skillType"
        v-bind:updateProjectDataSkills="updateProjectDataSkills"
        @upsert-skill="upsertSkill"
      >
      </SkillNamesbyType>
    </div>
  </div>
</template>

<script>
import SkillNamesbyType from "./SkillNamesByType";

export default {
  components: {
    SkillNamesbyType
  },

  props: {
    updateProjectDataSkills: Array
  },

  data() {
    return {
      skillsTypes: {},
      skills: [],
      skillsByType: {},
    }
  },

  methods: {
    readSkillsTypes() {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/types`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.skillsTypes = json.skillsTypes;
      });
    },

    findSkillIndexByType(type) {
      const index = this.skills.map(item => item.type).indexOf(type);
      return index;
    },

    upsertSkill(payload) {
      // Check to see if the type exists in skills
      const index = this.findSkillIndexByType(payload.type)
      if (index > -1) {
        // If it does, update the skill with the new value
        this.skills.splice(index, 1, payload);
      } else {
        // If it doesn't, push the skill onto skills
        this.skills.push(payload);
      }
      this.$emit("update-skills", this.skills);
    }
  },

  created() {
    this.readSkillsTypes();
  }
}
</script>

<style scoped>

</style>
