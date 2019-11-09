<template>
  <div id="admin-projects-form">
    <div>
      <pre>
        {{ projectData }}
      </pre>
    </div>
    <h3>{{ formAction }} a Project</h3>
      <form id="projects-form" enctype="multipart/form-data">
        <label for="name">Title</label>
        <input v-model="projectData.title" type="text" class="u-full-width" id="title" placeholder="The project title" required />
        <label for="description">Description</label>
        <textarea class="u-full-width" id="description" v-model="projectData.description" placeholder="Briefly explain the project and what problems it solves..."></textarea>
        <label for="screenshot">Screenshot</label>
        <input type="file" @change="onFileChange" id="screenshot" ref="screenshotFileInput">
        <label for="deployedLink">Deployed Link</label>
        <input v-model="projectData.deployedLink" type="text" class="u-full-width" id="deployedLink" placeholder="Enter a link to the deployed project" required />
        <label for="repoLink">Repository Link</label>
        <input v-model="projectData.repoLink" type="text" class="u-full-width" id="repoLink" placeholder="Enter a link to the repository where the project source code is hosted" required />
        <SkillsTypes
          v-bind:value="value"
          @update-skills="updateSkills"
        >
        </SkillsTypes>
        <label for="priority">Sort Priority</label>
        <input v-model="projectData.priority" type="number" class="u-quarter-width" id="priority" placeholder="Number" />
        <label for="show">Display Project?</label>
        <select v-model="projectData.show" class="u-quarter-width" id="show">
          <option disabled value="">Select one...</option>
          <option value="1">Yes</option>
          <option value="0">No</option>
        </select>
        <div class="right">
          <button v-on:click.prevent="submitProjectForm" class="button-primary" id="project-submit">{{ formAction }} Project</button>
          <button v-if="formAction === 'Edit'" v-on:click.prevent="cancelProjectSkill" class="edit-button-cancel">cancel</button>
      </div>
      </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import SkillsTypes from "./SkillsTypes";

export default {
  components: {
    SkillsTypes
  },
  
  props: {
    formAction: String,
    editProjectId: String,
    updateProjectData: Object,
  },

  data: () => {
    return {
      projectData: {
        title: "",
        description: "",
        file: null,
        deployedLink: "",
        repoLink: "",
        priority: null,
        skills: [],
        show: ""
      },
      value: "0"
    }
  },

  computed: {
    ...mapGetters([
      "jwt"
    ]),

    ...mapState([
      "statusCategory",
      "statusMessage"
    ])
  },

  methods: {
    submitProjectForm() {
      const userId = this.$store.getters.userId;
      const { title, description, deployedLink, repoLink, priority, skills, show } = this.projectData;
      const skillsArray = skills.map(skill => skill._id);
      const priorityInt = parseInt(priority);
      const showInt = parseInt(show);

      const formInputs = {
        userId,
        title,
        description,
        deployedLink,
        repoLink,
        priority: priorityInt,
        skills: JSON.stringify(skillsArray),
        show: showInt
      }

      if (this.formAction === "Add") {
        this.createProject(formInputs);
      }
    },

    onFileChange(e) {
      this.projectData.file = e.target.files[0];
    },

    cancelEditSkill() {
      this.clearSkillForm();
      this.$emit("cancel-edit-project");
    },

    clearProjectForm() {
      const keys = Object.keys(this.projectData);

      keys.forEach(e => {
        this.projectData[e] = null;
      });

      this.$refs.screenshotFileInput.type = 'text'
      this.$refs.screenshotFileInput.type = 'file'

      // Clear the dropdowns
      this.value = "";
    },

    createProject(formInputs) {
      const entries = Object.entries(formInputs);
      const file = this.projectData.file;

      const formData = new FormData();

      for (const [key, value] of entries) {
        formData.append(key, value);
      }

      formData.append("file", file);

      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects/create`, {
      method: "post",
      headers: {
        "Authorization": `Bearer ${this.jwt}`
      },
        body: formData
      }).then(response => {
        return response.json();
      }).then(dataObj => {
        if (dataObj._id) {
          this.$store.commit("setStatusCategory", "success");
          this.$store.commit("setStatusMessage", "Project created successfully.");
          this.$emit("project-created", dataObj);
          this.clearProjectForm();
        } else {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit("setStatusMessage", "Project was not created. Database error. ");          
        }
      }).catch(error => {
        this.$store.commit("setStatusCategory", "error");
        this.$store.commit("setStatusMessage", "Project was not created. " + error);
        return ({
          type: "error",
          message: "Internal server error.",
          error: error
        })
      });
    },

    updateSkills(newSkills) { // DON'T CHANGE THIS SKILLS
      this.projectData.skills = newSkills;
    }
  }
}
</script>

<style scoped>

</style>
