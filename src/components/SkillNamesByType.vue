<template>
  <select v-model="skillSelected" class="u-half-width" :id="parent">
    <option disabled value="">Select one...</option>
    <option v-for="{ _id, name } in skillNames" :value="{ parent, _id, name }" :key="_id">{{ name }}</option>
  </select>
</template>

<script>
export default {
  props: {
    parent: String,
    type: String,
    value: String
  },

  data: () => {
    return {
      skillNames: ""
    }
  },

  computed: {
    skillSelected: {
      get() { return this.value },
      set(v) { this.$emit("upsert-skill", v) }
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