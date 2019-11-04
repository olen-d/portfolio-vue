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
          <table>
            <thead>
              <tr>
                <th scope="col">Screenshot</th>
                <th scope="col">Title</th>
                <th scope="col">Description</th>
                <th scope="col">Skills</th>
                <th scope="col">Deployed Link</th>
                <th scope="col">Repository Link</th>
                <th scope="col">Sort Priority</th>
                <th scope="col">Display</th>
                <th scope="col"></th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody id="projects">
              <tr v-for="{ _id, deployedLink, description, projectTitle, repoLink, screenshot, priority, show } in projects" :key="_id" :id="_id">
                <td><img :src="`${publicPath}${screenshot}`" width="100" height="auto" :alt="`Screenshot of ${projectTitle}`"></td>
                <td>{{ projectTitle }}</td>
                <td>{{ description }}</td>
                <td>&nbsp;</td>
                <td class="url">{{ formatUrl(deployedLink) }}</td>
                <td class="url">{{ formatUrl(repoLink) }}</td>
                <td>{{ priority }}</td>
                <td>{{ formatShow(show) }}</td>
                <td><i @click="updateProject" class="fas fa-edit edit" :data-id="_id"></i></td>
                <td><i @click="confirmDeleteProject" class="fas fa-times delete" :data-id="_id" :data-title="projectTitle"></i></td>
              </tr>
            </tbody>
          </table>
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
          <!-- Project form goes here -->
        </div>
        <div class="one columns">
          &nbsp;
        </div>  
      </div>
    </div>
  </div>
</template>

<script>
import ModalConfirmCancel from "./ModalConfirmCancel";

export default {
  name: "AdminPagesProjects",

  components: {
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

    readProjects() {
        fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects`)
        .then((response) => {
          return response.json();
        })
        .then((json) => {
          this.projects = json.projects;
        });
      },
  },

  created() {
    this.readProjects();
  }
}

</script>

<style scoped>
.url {
  word-break: break-word;
  /* overflow: hidden; */
}
</style>
