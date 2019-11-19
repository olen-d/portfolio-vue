<template>
  <div id="adminDashboard" class="container">
    <div class="row">
      <div class="one columns">
        &nbsp;
      </div>
      <div class="ten columns">
        <h2>
          Dashboard
        </h2>
        <p>
          Welcome {{ firstName }}!
        </p>
      </div>
      <div class="one columns">
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  components: {
  },

  name: "AdminDashboard",

  computed: {
    ...mapGetters([ "firstName" ])
  }
}
</script>
