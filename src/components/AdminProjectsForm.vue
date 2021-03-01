<template>
  <div id="admin-projects-form">
    <form id="projects-form" enctype="multipart/form-data">
      <label for="name">Title</label>
      <input
        v-model="projectData.title"
        type="text"
        class="u-full-width"
        id="title"
        placeholder="The project title"
        required
      />
      <label for="description">Description</label>
      <textarea
        class="u-full-width"
        id="description"
        v-model="projectData.description"
        placeholder="Briefly explain the project and what problems it solves..."
      ></textarea>
      <label for="screenshot">Screenshot</label>
      <input
        type="file"
        @change="onFileChange"
        id="screenshot"
        ref="screenshotFileInput"
      />
      <label for="deployedLink">Deployed Link</label>
      <input
        v-model="projectData.deployedLink"
        type="text"
        class="u-full-width"
        id="deployedLink"
        placeholder="Enter a link to the deployed project"
        required
      />
      <label for="repoLink">Repository Link</label>
      <input
        v-model="projectData.repoLink"
        type="text"
        class="u-full-width"
        id="repoLink"
        placeholder="Enter a link to the repository where the project source code is hosted"
        required
      />
      <SkillsCheckboxes
        v-bind:initialCheckedSkills="updateProjectData.skills"
        v-bind:shouldClearCheckedSkills="shouldClearCheckedSkills"
        v-on:checked-skills-were-cleared="handleCheckedSkillsWereCleared"
        v-on:update-skills="handleUpdateSkills"
      >
      </SkillsCheckboxes>
      <label for="priority">Sort Priority</label>
      <input
        v-model="projectData.priority"
        type="number"
        class="u-quarter-width"
        id="priority"
        placeholder="Number"
      />
      <label for="show">Display Project?</label>
      <select v-model="projectData.show" class="u-quarter-width" id="show">
        <option disabled value="">Select one...</option>
        <option value="1">Yes</option>
        <option value="0">No</option>
      </select>
      <div class="right">
        <button
          v-on:click.prevent="submitProjectForm"
          class="button-primary"
          id="project-submit"
        >
          {{ formAction }} Project
        </button>
        <button
          v-if="formAction === 'Edit'"
          v-on:click.prevent="cancelEditProject"
          class="edit-button-cancel"
        >
          cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

import SkillsCheckboxes from "./SkillsCheckboxes";

export default {
  components: {
    SkillsCheckboxes
  },

  props: {
    formAction: String,
    editProjectId: String,
    method: { type: Function },
    updateProjectData: {
      type: Object,
      default: () => {
        return { skills: [] };
      }
    },
    wasSubmitted: Boolean
  },

  data: () => {
    return {
      projectData: {
        title: "",
        description: "",
        file: "",
        deployedLink: "",
        repoLink: "",
        priority: "",
        skills: [],
        show: ""
      },
      shouldClearCheckedSkills: false
    };
  },

  computed: {
    ...mapGetters(["jwt"]),

    ...mapState(["statusCategory", "statusMessage"]),

    fl() {
      return typeof this.projectData.file;
    }
  },

  watch: {
    editProjectId(newValue) {
      if (this.formAction === "Edit") {
        this.projectData = JSON.parse(JSON.stringify(this.updateProjectData));
      }
    },
    wasSubmitted() {
      this.clearProjectForm();
    }
  },

  methods: {
    handleCheckedSkillsWereCleared() {
      this.shouldClearCheckedSkills = false;
    },

    submitProjectForm() {
      const userId = this.$store.getters.userId;
      const {
        title,
        description,
        deployedLink,
        repoLink,
        priority,
        file,
        skills,
        show
      } = this.projectData;
      const priorityInt = parseInt(priority);
      const showInt = parseInt(show);

      const formInputs = {
        userId,
        title,
        description,
        deployedLink,
        repoLink,
        priority: priorityInt,
        file,
        skills: JSON.stringify(skills),
        show: showInt
      };
      this.$emit("send-form-data", formInputs);
      // if (this.formAction === "Add") {
      //   this.createProject(formInputs);
      // } else if (this.formAction === "Edit") {
      //   this.updateProject(formInputs);
      // }
    },

    onFileChange(e) {
      this.projectData.file = e.target.files[0];
    },

    cancelEditProject() {
      this.clearProjectForm();
      this.$emit("cancel-edit-project");
    },

    clearProjectForm() {
      const keys = Object.keys(this.projectData);

      keys.forEach(e => {
        this.projectData[e] = "";
      });

      this.$refs.screenshotFileInput.type = "text";
      this.$refs.screenshotFileInput.type = "file";

      // this.$emit("clear-selected-skills");
      this.shouldClearCheckedSkills = true;
      this.$emit("reset-was-submitted");
    },

    handleUpdateSkills(newSkills) {
      this.projectData.skills = newSkills;
    }
  }
};
</script>

<style scoped>
.edit-button-cancel {
  margin-left: 1rem;
}
</style>
