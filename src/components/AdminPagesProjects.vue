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
          <div v-for="{ _id, deployedLink, description, projectTitle, repoLink, screenshot, priority, show } in projects" :key="_id" :id="_id" class="card-container">
            <div class="card-actions">
              <i @click="updateProject" class="fas fa-edit edit" :data-id="_id"></i>
              <i @click="confirmDeleteProject" class="fas fa-times delete" :data-id="_id" :data-title="projectTitle"></i>
            </div>
            <AdminProjectsCard
              v-bind="{ _id, deployedLink, description, projectTitle, repoLink, screenshot, priority, show }"
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
            @cancel-edit-project="cancelEditProject"
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
      publicPath: process.env.BASE_URL,
      formAction: "Add",
      editProjectId: "",
      updateProjectData: {
        type: "",
        name: "",
        description: "",
        icon: "",
        priority: null,
        show: ""
      },
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

    updateProject(e) {
      // 
    },

    confirmDeleteProject(e) {
      //
    }
  },

  created() {
    this.readProjects();
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