<template>
  <div id="skills-types">skills.vue: {{ skills }}
    <div id="skill-type" v-for="(n, index) in skillCount" :key="n">
      <SkillNames
        v-bind:skillsSelected="skills"
        v-bind:selectNumber="index"
        v-bind:skillCount="skillCount"
        v-bind:updateProjectDataSkills="updateProjectDataSkills"
        @upsert-skill="upsertSkill"
        @add-skill-select="addSkillSelect"
      >
      </SkillNames>
    </div>
  </div>
</template>

<script>
import SkillNames from "./SkillNames";

export default {
  components: {
    SkillNames
  },

  props: {
    updateProjectDataSkills: Array
  },

  data() {
    return {
      skillCount: 1,
      // skillsTypes: {},
      skills: [],
      // skillsByType: {}
    }
  },

  methods: {
    // readSkillsTypes() {
    //   fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/types`)
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((json) => {
    //     this.skillsTypes = json.skillsTypes;
    //   });
    // },

    findSkillIndexById(_id) {
      const index = this.skills.indexOf(_id);
      return index;
    },

    upsertSkill(payload) { console.log("SKILLS.VUE -- UPSERT PAYLOAD\n", payload);
      // Check to see if the skill exists in skills
      const index = this.findSkillIndexById(payload._id)
      if (index === -1) {
        // If it does not, push the skill onto skills
        this.skills.push(payload._id);
        this.$emit("update-skills", this.skills);
      } else {
        // If it does, do nothing
        // TODO: Add some sort of error/already chosen trap
      }

    },

    addSkillSelect(skillCount){
      this.skillCount = skillCount;
    }
  },

  created() {
    // this.readSkillsTypes();
    
  }
}
</script>

<style scoped>

</style>
