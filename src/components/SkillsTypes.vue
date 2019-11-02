<template>
  <div id="skills-types">
    <div id="skill-type" v-for="skillType in skillsTypes" :key="skillType">
      {{ skillType }}
      <SkillNamesbyType
        v-bind:parent="skillType"
        v-bind:type="skillType"
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

  data: () => {
    return {
      skillsTypes: ""
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
    }
  },

  created() {
    this.readSkillsTypes();
  }
}
</script>

<style scoped>

</style>
