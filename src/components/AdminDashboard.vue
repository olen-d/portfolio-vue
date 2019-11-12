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
        <SkillsTypes v-bind:updateProjectDataSkills="[0]"></SkillsTypes>
      </div>
      <div class="one columns">
        &nbsp;
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import SkillsTypes from "./SkillsTypes";

export default {
  components: {
    SkillsTypes
  },

  name: "AdminDashboard",

  computed: {
    ...mapGetters([ "firstName" ])
  }
}
</script>
