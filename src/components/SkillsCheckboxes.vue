<template>
  <div class="skills">
    <div class="skill u-third-width" v-for="{ _id, type, name } in skills" :key="_id">
      <input type="checkbox" :id="name" :value ="_id" v-model="checkedSkills" @change="onChange">
      <label class="skill-label" :for="name">{{ name }}</label>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    clearSkills: Boolean
  },

  data: () => {
    return {
      skills: [],
      checkedSkills: []
    }
  },

  watch: {
    clearSkills: function(newValue) {
      if(newValue) {
        this.doClearSkills();
      }
    }
  },

  methods: {
    readSkills() {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/sort/type+name`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.skills = json.skills;
      });
    },

    onChange(event) {
      this.$emit("update-skills", this.checkedSkills);
    },

    doClearSkills() {
      this.checkedSkills = [];
      this.$emit("reset-clear-skills", false);
    }
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

.skills {
  justify-content: flex-start;
}

.skill {
  margin-top: 1.5rem;
}

.skill input,
.skill label {
  display: inline-block;
  margin-bottom: 0rem;
  vertical-align: middle;
  text-align: left;
}

.skill label {
  margin-left: 1.0rem;
}

</style>
