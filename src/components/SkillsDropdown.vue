<template>
  <select name="filter-skills" v-model="filterSkill" @change="onChange">
    <option disabled value="">Select one...</option>
    <option v-for="{ _id, name } in skills" :key="_id" :value="_id">
      {{ name }}
    </option>
  </select>
</template>

<script>
export default {
  data: () => {
    return {
      skills: [],
      filterSkill: ""
    };
  },

  methods: {
    readSkills() {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/sort/type+name`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.skills = json.skills;
        });
    },

    onChange(event) {
      this.$emit("filter-projects-by-skill", this.filterSkill);
    }
  },

  created() {
    this.readSkills();
  }
};
</script>

<style scoped></style>
