<template>
  <div class="admin-projects-card">
    <div class="screenshot">
      <img :src="`${publicPath}assets/images/${screenshot}`" width="200" height="auto" :alt="`Screenshot of ${title}`">
    </div>
    <div class="title">
      {{ title }}
    </div>
    <div class="description">
      {{ description }}
    </div>
    <div class="links">
      <p>
        Deployed at:<br />
        {{ deployedLink }}
      </p>
      <p>
        Code Repository: <br />
        {{ repoLink }}
      </p>
    </div>
    <div class="skills">
      <p>
        Skills: <br />
        {{ skillNames }}
      </p>
    </div>
    <div class="meta">
      <p>
        Sort Priority: {{ priority }}
      </p>
      <p>
        Display: {{ formatShow(show) }}
      </p>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    _id: String, 
    deployedLink: String, 
    description: String, 
    title: String, 
    repoLink: String, 
    screenshot: String,
    skills: Array,
    priority: Number, 
    show: Number
  },

  data: () => {
    return {
      publicPath: process.env.BASE_URL,
      skillsData: [],
      skillNamesById: []
    }
  },

  computed: {
    skillNames() {
      let skillNamesOutput = "";
      if(this.skills) {
        this.skills.forEach(skill => {
          let index = this.skillNamesById.map(item => item._id).indexOf(skill);
          if(index > -1) {
            skillNamesOutput += this.skillNamesById[index].name + ", ";
          }
        });
      } else {
        skillNamesOutput = "No skills were found for this project."
      }
      skillNamesOutput = skillNamesOutput.replace(/,\s*$/, "")
      return skillNamesOutput;
    }
  },

  methods: {
    formatShow: show => {
      if (show == 1) {
        return "Yes";
      } else {
        return "No";
      }
    },

    readSkills() {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills`)
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.skillsData = json.skills;
      })
      .then(() => {
        this.mapSkillNames();
      });
    },

    mapSkillNames() {
      this.skillsData.forEach(skill => {
        let _id = skill._id;
        let name = skill.name;
        this.skillNamesById.push({_id, name});
      });
    }
  },

  created() {
    this.readSkills();
  }
}
</script>

<style scoped>

</style>
