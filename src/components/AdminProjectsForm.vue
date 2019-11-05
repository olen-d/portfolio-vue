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
        <input type="file" @change="onFileChange" id="screenshot">
        <label for="deployedLink">Deployed Link</label>
        <input v-model="projectData.deployedLink" type="text" class="u-full-width" id="deployedLink" placeholder="Enter a link to the deployed project" required />
        <label for="repoLink">Repository Link</label>
        <input v-model="projectData.repoLink" type="text" class="u-full-width" id="repoLink" placeholder="Enter a link to the repository where the project source code is hosted" required />
        <SkillsTypes
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
      }

    }
  },

  methods: {
    onFileChange(e) {
      this.projectData.file = e.target.files[0];
    },

    cancelEditSkill() {
      this.clearSkillForm();
      this.$emit("cancel-edit-project");
    },

    clearSkillForm() {
      const keys = Object.keys(this.projectData);

      keys.forEach(e => {
        this.projectData[e] = null;
      });
    },

    updateSkills(newSkills) {
      this.projectData.skills = newSkills;
    }
  }
}
</script>

<style scoped>

</style>
