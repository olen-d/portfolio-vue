<template>
  <div class="admin-pages-projects-add">
    <h3>Add a Project</h3>
    <AdminProjectsForm
      v-on:reset-was-submitted="handleResetWasSubmitted"
      v-on:send-form-data="handleSendFormData"
      formAction="Add"
      v-bind:wasSubmitted="wasSubmitted"
    >
    </AdminProjectsForm>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import AdminProjectsForm from "./AdminProjectsForm.vue";

export default {
  components: {
    AdminProjectsForm
  },

  data: () => {
    return {
      wasSubmitted: false
    };
  },

  computed: {
    ...mapGetters(["jwt"])
  },
  methods: {
    handleResetWasSubmitted() {
      this.wasSubmitted = false;
    },

    handleSendFormData(value) {
      this.createProject(value);
    },

    createProject(formInputs) {
      const entries = Object.entries(formInputs);
      const formData = new FormData();

      for (const [key, value] of entries) {
        formData.append(key, value);
      }

      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/projects/create`, {
        method: "post",
        headers: {
          Authorization: `Bearer ${this.jwt}`
        },
        body: formData
      })
        .then(response => {
          return response.json();
        })
        .then(dataObj => {
          if (dataObj._id) {
            this.$store.commit("setStatusCategory", "success");
            this.$store.commit(
              "setStatusMessage",
              "Project created successfully."
            );
            this.$emit("project-created", dataObj);
            this.wasSubmitted = true;
          } else {
            this.$store.commit("setStatusCategory", "error");
            this.$store.commit(
              "setStatusMessage",
              "Project was not created. Database error. "
            );
          }
        })
        .catch(error => {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit(
            "setStatusMessage",
            "Project was not created. " + error
          );
          return {
            type: "error",
            message: "Internal server error.",
            error: error
          };
        });
    }
  }
};
</script>
