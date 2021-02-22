<template>
  <div class="admin-dashboard">
    <h2>
      Dashboard
    </h2>
    <p>Welcome {{ firstName }}!</p>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AdminDashboard",

  computed: {
    ...mapGetters(["firstName"])
  }
};
</script>
