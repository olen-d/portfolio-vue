<template>
  <span class="fragment">
    <label :for="type" class="capitalize">{{ type }}</label>
    <select v-model="skillSelected" class="u-half-width" :id="type">
      <option disabled :value="value">Select one...</option>
      <option v-for="{ _id, name } in skillNames" :value="_id" :key="_id">{{ name }}</option>
    </select>
  </span>
</template>

<script>
export default {
  props: {
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
