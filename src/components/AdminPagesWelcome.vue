<template>
  <div class="admin-pages-welcome">
    <h3>
      Welcome
    </h3>
    <AdminFormHeadline
      :contentId="this.welcome[0]?._id"
      :defaultValue="this.welcome[0]?.headline"
      :formAction="formAction"
    />
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import AdminFormHeadline from "@/components/AdminFormHeadline.vue"

export default {
  name: "AdminPagesWelcome",

  components: { AdminFormHeadline },

  data: () => {
    return {
      welcome: [],
      formAction: "Add"
    }
  },

  computed: {
    ...mapGetters(["jwt"])
  },

  methods: {
    //
  },

  created() {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/welcome`)
      .then(response => {
        return response.json();
      })
      .then(json => {
        if (json.welcome.length > 0) {
          this.welcome.push(json.welcome["0"]);
          this.formAction = "Update"
        } else {
          this.formAction = "Add";
        }
      });
  }
}
</script>

<style scoped>
textarea {
  height: 16rem;
}
</style>
