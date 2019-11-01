<template>
  <div id="status-bar-container" v-bind:style="statusBarStyle">
    <i v-bind:class="icon"></i>&nbsp;{{ statusUpdate }}
  </div>
</template>

<script>
import { mapGetters, mapState } from "vuex";

export default {

  data: () => {
    return {
      statusBarStyle: {
        color: "#444444",
        backgroundColor: "#cccccc"
      },
      icon: ""
    }
  },

  computed: {
    ...mapState([
      "statusCategory",
      "statusMessage",
      "statusAction"
    ]),

    statusUpdate: function() {
      switch(this.statusCategory) {
      case "success":
        this.statusBarStyle.backgroundColor = "#95ff95";
        this.statusBarStyle.color = "#00aa00";
        this.icon ="fas fa-check-circle";
        break;
      case "information":
        this.statusBarStyle.backgroundColor = "#bfbfff";
        this.statusBarStyle.color = "#0000aa";
        this.icon = "fas fa-info-circle";
        break;
      case "warning":
        this.statusBarStyle.backgroundColor = "#ffff55";
        this.statusBarStyle.color = "#c6c600";
        this.icon = "fas fa-exclamation-triangle";
        break;
      case "error":
        this.statusBarStyle.backgroundColor = "#ff9595";
        this.statusBarStyle.color = "#aa0000";
        this.icon = "fas fa-bomb";
        break;          
      }
      setTimeout(() => {
        this.$store.commit("setStatusMessage", ""); 
        this.$store.commit("setStatusCategory", "") 
        }, 
        1000 * 5
      );
      return(this.statusMessage);
    }
  }
}
</script>

<style scoped>
#status-bar-container {
  position: fixed;
  top: 6rem;
  padding: 2rem;
  width: 100%;
  z-index:8000;
}
</style>
