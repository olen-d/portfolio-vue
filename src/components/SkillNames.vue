<template>
  <span class="fragment">
    <label :for="'skill'+selectNumber" class="capitalize">Skill</label>
    <select v-model="selectedOption" class="u-half-width" :id="'skill'+selectNumber">
      <option disabled value="0">Select a skill...</option>
      <option v-for="{ _id, name } in remainingSkills" :value="_id" :key="_id">{{ name }}</option>
    </select>
  </span>
</template>

<script>
export default {
  props: {
    selectNumber: Number,
    skillsSelected: Array,
    updateProjectDataSkills: Array,
    skillCount: Number
  },

  data: () => {
    return {
      skills: [],
      remainingSkills: [],
    }
  },

  computed: {
    allSkillIds() {
      return this.remainingSkills.map(skill => skill._id)
    },

    selectedOption: {
      get() { 
        if(this.updateProjectDataSkills[0] === 0) {
        return "0";
        } else {
          const projectSkillIds = this.updateProjectDataSkills.map(skill => skill._id);
          const matches = projectSkillIds.filter(v => this.allSkillIds.includes(v));
          if (typeof(matches[0]) === "undefined") {
            return "0";
          } else {
            return matches[0];
          }
        }
      },

      set(v) { 
        const sc = this.skillCount + 1;
        const payload = new Object();
        payload._id = v;
        
        this.$emit("upsert-skill", payload);
        this.$emit("add-skill-select", sc);
      }
    }
  },

  methods: {
    readSkills() {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.skills = json.skills;
        this.cloneSkills();
        this.updateRemainingSkills();
      });
    },

    cloneSkills() {
      this.remainingSkills = [...this.skills];
    },

    updateRemainingSkills() {
      this.skillsSelected.forEach(id => {
        const index = this.remainingSkills.map(item => item._id).indexOf(id);
        if(index > -1) {
          this.remainingSkills.splice(index, 1);
        }
      });
    },
  },

  created() {
    this.readSkills();
  }
}
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>
