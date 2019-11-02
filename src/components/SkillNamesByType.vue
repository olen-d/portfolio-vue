<template>
  <select v-model="skillNameSelect" class="u-quarter-width" :id="parent">
    <option disabled value="">Select one...</option>
    <option v-for="item in skillNames" :value="item.name" :key="item._id">{{ item.name }}</option>
  </select>
</template>

<script>
export default {
  props: {
    parent: String,
    type: String
  },

  data: () => {
    return {
      skillNames: "",
      skillNameSelect: "",
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

</style>