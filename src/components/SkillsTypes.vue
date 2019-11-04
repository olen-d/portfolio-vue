<template>
  <div id="skills-types">
    <pre>
            {{ skills }}
    </pre>
    <div id="skill-type" v-for="skillType in skillsTypes" :key="skillType">
      <div class="u-quarter-width skill-type">
        {{ skillType }}
      </div>
      <SkillNamesbyType
        v-bind:parent="skillType"
        v-bind:type="skillType"
        v-bind:value="''"
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

  data: () => {
    return {
      skillsTypes: "",
      skills: []
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

    findSkillIndexByParent(parent) {
      const index = this.skills.map(item => item.parent).indexOf(parent);
      return index;
    },

    upsertSkill(v) {
      // Check to see if the parent exists in skills
      const index = this.findSkillIndexByParent(v.parent)
      if (index > -1) {
        // If it does, update the skill with the new value
        this.skills.splice(index, 1, v);
      } else {
        // If it doesn't, push the skill onto skills
        this.skills.push(v);
      }
    }
  },

  created() {
    this.readSkillsTypes();
  }
}
</script>

<style scoped>
.skill-type {
  float: left;
  padding-top: 0.75rem;
  padding-right: 2rem;
  text-transform: capitalize;
  text-align: right;
}
</style>
