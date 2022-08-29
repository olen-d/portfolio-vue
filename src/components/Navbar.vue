<template>
  <div>
    <NavbarAdmin
      v-if="isAuthorized && showAdmin"
      v-bind:showStandard="showStandard"
      v-bind:showHamburger="showHamburger"
    >
    </NavbarAdmin>
    <NavbarFrontEnd
      v-else
      v-bind:showStandard="showStandard"
      v-bind:showHamburger="showHamburger"
    >
    </NavbarFrontEnd>
    <UserMenu
      v-if="isAuthorized"
    >
    </UserMenu>
  </div>
</template>

<script>
import NavbarFrontEnd from "./NavbarFrontEnd.vue";
import NavbarAdmin from "./NavbarAdmin.vue";
import UserMenu from "./UserMenu.vue";

export default {
  components: {
    NavbarFrontEnd,
    NavbarAdmin,
    UserMenu
  },

  data: () => { // TODO: Set up the DB to include this information. Remember, only the links are coming from the DB. Window is coded here.
    return {
      window: {
          width: 0,
          height: 0
      }
    }
  },

  computed: {
    isAuthorized: function () {
      return this.$store.getters.authorized;
    },

    showFrontEnd: function() {
      return !this.$store.getters.administrator;
    },

    showStandard: function() {
      return this.window.width >= 500;
    },
    showHamburger: function() {
      return this.window.width < 500;
    },
    showAdmin: function() {
      return this.$store.getters.administrator;
    }
  },

  created() {
    window.addEventListener("resize", this.handleResize);
    this.handleResize();
  },

  destroyed() {
    window.removeEventListener("resize", this.handleResize);
  },

  methods: {
    handleResize() {
      this.window.width = window.innerWidth;
      this.window.height = window.innerHeight;
    }
  }
}
</script>

<style>

</style>
