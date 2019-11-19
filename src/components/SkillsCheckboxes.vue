<template>
  <div class="fragment">
    <div class="skills-heading">
      Skills
    </div>
    <div class="skills">
      <div class="skill u-third-width" v-for="{ _id, type, name } in skills" :key="_id">
        <input type="checkbox" :id="name" :value ="_id" v-model="checkedSkills" @change="onChange">
        <label class="skill-label" :for="name">{{ name }}</label>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    initialCheckedSkills: Array
  },

  data() {
    return {
      skills: [],
      checkedSkills: this.initialCheckedSkills
    }
  },

  watch: {
    initialCheckedSkills(newValue) {
      this.checkedSkills = this.initialCheckedSkills;
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
    }
  },

  created() {
    this.readSkills();
  }
}
</script>

<style scoped>
.fragment {
  margin-bottom: 1.5rem;
}

.skills-heading {
  font-weight: 600;
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
  font-weight: 400;
  margin-bottom: 0rem;
  vertical-align: middle;
  text-align: left;
}

.skill label {
  margin-left: 1.0rem;
}

</style>
