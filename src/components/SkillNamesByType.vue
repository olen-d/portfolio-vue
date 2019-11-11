<template>
  <span class="fragment">
    <label :for="type" class="capitalize">{{ type }}</label>
    <select v-model="skillSelected" class="u-half-width" :id="type">
      <option disabled value="0">Select one...</option>
      <option v-for="{ _id, name } in skillNames" :value="_id" :key="_id">{{ name }}</option>
    </select>
  </span>
</template>

<script>
export default {
  props: {
    type: String,
    updateProjectDataSkills: Array
  },

  data: () => {
    return {
      skillNames: "",
    }
  },

  computed: {
    skillSelected: {
      get() { 
        if(this.updateProjectDataSkills[0] === 0) {
        return "0";
        } else {
          const allSkills = this.skillNames.map(skill => skill._id);
          const matches = this.updateProjectDataSkills.filter(v => allSkills.includes(v));
          if (typeof(matches[0]) === "undefined") {
            return "0";
          } else {
            return matches[0];
          }
        }
      },

      set(v) { 
        const payload = new Object(); 
        payload.type = this.type;
        payload._id = v;
        this.$emit("upsert-skill", payload) 
      }
    }
  },

  methods: {
    readSkillNamesByType(type) {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/names/${type}`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.skillNames = json.skillNames;
      });
    }
  },

  created() {
    this.readSkillNamesByType(this.type);
  }
}
</script>

<style scoped>
.capitalize {
  text-transform: capitalize;
}
</style>
