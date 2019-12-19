<template>
  <div id="admin-pages-projects">
    <ModalConfirmCancel
      v-if="showModalConfirmCancel"
      v-bind:payload="modalConfirmCancelProps.payload"
      v-bind:action="modalConfirmCancelProps.action"
      v-bind:title="modalConfirmCancelProps.title"
      v-bind:message="modalConfirmCancelProps.message"
      v-bind:confirm="modalConfirmCancelProps.confirm"
      v-bind:cancel="modalConfirmCancelProps.cancel"
      @confirm-action="confirmAction"
      @cancel-action="cancelAction"
    >
    </ModalConfirmCancel>
    <div class="container">
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <h3>
            Projects
          </h3>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <h4>
            Filter
          </h4>
          <SkillsDropdown @filter-projects-by-skill="filterProjectsBySkill" />
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <div
            v-for="{
              _id,
              deployedLink,
              description,
              title,
              repoLink,
              screenshot,
              skills,
              priority,
              show
            } in projects"
            :key="_id"
            :id="_id"
            class="card-container"
          >
            <div class="card-actions">
              <i
                @click="updateProject"
                class="fas fa-edit edit"
                :data-id="_id"
              ></i>
              <i
                @click="confirmDeleteProject"
                class="fas fa-times delete"
                :data-id="_id"
                :data-title="title"
              ></i>
            </div>
            <AdminProjectsCard
              v-bind="{
                _id,
                deployedLink,
                description,
                title,
                repoLink,
                screenshot,
                skills,
                priority,
                show
              }"
            >
            </AdminProjectsCard>
          </div>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <AdminProjectsForm
            v-bind:formAction="formAction"
            v-bind:editProjectId="editProjectId"
            v-bind:updateProjectData="updateProjectData"
            @project-created="projectCreated"
            @project-updated="projectUpdated"
            @cancel-edit-project="cancelEditProject"
            @clear-selected-skills="clearSelectedSkills"
          >
          </AdminProjectsForm>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import AdminProjectsCard from "./AdminProjectsCard";
import AdminProjectsForm from "./AdminProjectsForm";
import ModalConfirmCancel from "./ModalConfirmCancel";
import SkillsDropdown from "./SkillsDropdown";

export default {
  name: "AdminPagesProjects",

  components: {
    AdminProjectsCard,
    AdminProjectsForm,
    ModalConfirmCancel,
    SkillsDropdown
  },

  data: () => {
    return {
      projects: [],
      publicPath: process.env.BASE_URL,
      formAction: "Add",
      editProjectId: "",
      updateProjectData: { skills: [0] },
      showModalConfirmCancel: false,
      modalConfirmCancelProps: {
        payload: {
          action: "",
          data: ""
        },
        title: "",
        message: "",
        confirm: "ok",
        cancel: "cancel"
      },
      filterSkill: ""
    };
  },

  computed: {
    ...mapGetters(["jwt"])
  },

  methods: {
    formatUrl: url => {
      const urlPieces = url.split("://");
      return urlPieces[1];
    },

    formatShow: show => {
      if (show == 1) {
        return "Yes";
      } else {
        return "No";
      }
    },

    readProjects() {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          this.projects = json.projects;
        });
    },

    findProjectIndexById(projectId) {
      const index = this.projects.map(item => item._id).indexOf(projectId);
      return index;
    },

    createProjectsAddCard(e) {
      this.projects.push(e);
    },

    deleteProjectsRemoveCard(projectId) {
      const index = this.findProjectIndexById(projectId);
      if (index > -1) {
        this.projects.splice(index, 1);
      }
    },

    projectCreated(e) {
      if (e._id) {
        this.createProjectsAddCard(e);
        // TODO: Update status bar with success result
      } else {
        // TODO: Update status bar with fail result
      }
    },

    updateProjectCard(projectId) {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects/id/${projectId}`)
        .then(response => {
          return response.json();
        })
        .then(json => {
          const updatedProjectData = json.project;
          const index = this.findProjectIndexById(projectId);

          const {
            _id,
            userId,
            title,
            description,
            deployedLink,
            repoLink,
            screenshot,
            skills,
            priority,
            show,
            updatedAt
          } = updatedProjectData;

          const updatedProjectObj = {
            _id,
            userId,
            title,
            description,
            deployedLink,
            repoLink,
            screenshot,
            skills,
            priority,
            show,
            updatedAt
          };

          this.projects.splice(index, 1, updatedProjectObj);

          this.formAction = "Add";
          this.projectSkillId = "";
        });
    },

    projectUpdated(projectId) {
      this.updateProjectCard(projectId);
      // Update status bar with result
    },

    updateProject(e) {
      const projectId = e.currentTarget.getAttribute("data-id");
      const projectIndex = this.findProjectIndexById(projectId);
      const project = { ...this.projects[projectIndex] }; // Clone the current project object
      project.file = "";

      delete project._id;

      this.updateProjectData = project;

      this.formAction = "Edit";
      this.editProjectId = projectId;
    },

    cancelEditProject() {
      this.formAction = "Add";
    },

    deleteProject(projectId) {
      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects/delete`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${this.jwt}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ projectId: projectId })
      })
        .then(response => {
          return response.json();
        })
        .then(dataObj => {
          const { ok, deletedCount } = dataObj;
          if (ok === 1 && deletedCount === 1) {
            this.$store.commit("setStatusCategory", "success");
            this.$store.commit(
              "setStatusMessage",
              "Project deleted successfully."
            );
            this.deleteProjectsRemoveCard(projectId);
          } else {
            this.$store.commit("setStatusCategory", "error");
            this.$store.commit(
              "setStatusMessage",
              "Project was not deleted. Database error. "
            );
          }
        })
        .catch(error => {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit(
            "setStatusMessage",
            "Project was not deleted. " + error
          );
          return {
            errorCode: 500,
            errorMsg: "Internal Server Error",
            errorDetail: error
          };
        });
    },

    confirmDeleteProject(e) {
      const projectId = e.currentTarget.getAttribute("data-id");
      const projectName = e.currentTarget.getAttribute("data-title");

      this.modalConfirmCancelProps.payload.action = "delete";
      this.modalConfirmCancelProps.payload.data = projectId;
      this.modalConfirmCancelProps.title = "Delete Project";
      this.modalConfirmCancelProps.message = `Do you really want to delete the project: ${projectName}?`;
      this.modalConfirmCancelProps.confirm = "delete";

      this.setShowModalConfirmCancel(true);
    },

    setShowModalConfirmCancel(value) {
      this.showModalConfirmCancel = value;
    },

    cancelAction() {
      this.setShowModalConfirmCancel(false);
    },

    confirmAction(v) {
      switch (v.action) {
        case "delete":
          this.deleteProject(v.data);
          break;
      }
      this.setShowModalConfirmCancel(false);
    },

    clearSelectedSkills() {
      this.updateProjectData.skills = [0];
    },

    filterProjectsBySkill(filterSkill) {
      this.filterSkill = filterSkill;
    }
  },

  created() {
    this.readProjects();
  }
};
</script>

<style scoped>
.card-actions {
  margin-top: 3rem;
  margin-bottom: 3rem;
}

.card-container {
  margin-top: 6rem;
  padding: 0rem;
  /* background-color:#aaa; */
}

.url {
  word-break: break-word;
  /* overflow: hidden; */
}
</style>
