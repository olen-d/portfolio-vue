<template>
  <div id="admin-pages-projects">
    <ModalConfirmCancel
      v-if="showModalConfirmCancel"
      v-bind:payload = modalConfirmCancelProps.payload
      v-bind:action = modalConfirmCancelProps.action
      v-bind:title = modalConfirmCancelProps.title
      v-bind:message = modalConfirmCancelProps.message 
      v-bind:confirm = modalConfirmCancelProps.confirm
      v-bind:cancel = modalConfirmCancelProps.cancel
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
          <div v-for="{ _id, deployedLink, description, title, repoLink, screenshot, priority, show } in projects" :key="_id" :id="_id" class="card-container">
            <div class="card-actions">
              <i @click="updateProject" class="fas fa-edit edit" :data-id="_id"></i>
              <i @click="confirmDeleteProject" class="fas fa-times delete" :data-id="_id" :data-title="title"></i>
            </div>
            <AdminProjectsCard
              v-bind="{ _id, deployedLink, description, title, repoLink, screenshot, priority, show }"
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
            @clear-dropdowns="clearDropdowns"
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
import AdminProjectsCard from "./AdminProjectsCard";
import AdminProjectsForm from "./AdminProjectsForm";
import ModalConfirmCancel from "./ModalConfirmCancel";


export default {
  name: "AdminPagesProjects",

  components: {
    AdminProjectsCard,
    AdminProjectsForm,
    ModalConfirmCancel
  },

  data: () => {
    return {
      projects: [],
      // skillsTypes: [],
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
      }
    }
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

    findProjectIndexById(projectId) {
      const index = this.projects.map(item => item._id).indexOf(projectId);
      return index;
    },

    createProjectsAddCard(e) {
      this.projects.push(e);
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
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        const updatedProjectData = json.project;
        const index = this.findProjectIndexById(projectId);

        const { _id, userId, title, description, deployedLink, repoLink, screenshot, skills, priority, show, updatedAt } = updatedProjectData;

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

    cancelEditProject() {
      this.formAction = "Add";
    },

    readProjects() {
        fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.projects = json.projects;
        });
      },

    // readSkillsToType() {
    //     fetch(`${process.env.VUE_APP_API_BASE_URL}/api/skills/to/type`)
    //     .then((response) => {
    //       return response.json();
    //     })
    //     .then((json) => {
    //       this.skillsTypes = json.skills;
    //     });
    // },

    confirmDeleteProject(e) {
      //
    },

    updateProject(e) {
      const projectId = e.currentTarget.getAttribute("data-id");
      const projectIndex = this.findProjectIndexById(projectId);
      const project = {...this.projects[projectIndex]}; // Clone the current project object
console.log("PROJECT\n", project);
      project.file = "";

      delete project._id;
      // delete project.userId;
 
      // project.skills.forEach((skill, i) => {
      //   const index = this.skillsTypes.map(item => item._id).indexOf(skill);
      //   project.skills[i] = this.skillsTypes[index];
      // });

      this.updateProjectData = project;

      this.formAction = "Edit";
      this.editProjectId = projectId;
    },

    clearDropdowns() {
      this.updateProjectData.skills = [0];
    }
  },

  created() {
    this.readProjects();
    // this.readSkillsToType();
  }
}

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
