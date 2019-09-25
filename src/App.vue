<template>
  <div id="app">
    <Navbar />
      <div class="logo-header">
        <img src="/assets/images/OD_min_500x500.png" width="200px" height="200px" />
      </div>
    <router-view />
    <div class="footer">
	    <Social />
      <div class="container">	
        <div class="row">
          <div class="four columns">
            &nbsp;
          </div>
          <div class="four columns">
            <p>
              Copyright &copy; 2019 Olen Daelhousen
            </p>
          </div>
          <div class="four columns">
            <p class="right">
              Login Signup
            </p>
          </div>
        </div>
      </div>
		</div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { store } from "./store/store";
import Navbar from "./components/Navbar.vue";
import Social from "./components/Social.vue";

export default {
  name: 'app',
  store,
  components: {
    Navbar,
    Social
  },

  data: () => {
    return {

    } 
  },

  computed: {
    ...mapGetters([
      "jwt",
      "userId",
      "userName",
      "firstName",
      "lastName",
      "administrator",
      "editor"
    ])
  },

  methods: {
    ...mapActions([
      "fetchJWT"
    ])
  },

  watch: {
    $route (value, to, from) {

      // Fetch the JWT and hydrate the store when a different page is navigated to
      if (to !== from) {
        this.fetchJWT();
      }

      // Clear the JWT if the logout link is hit
      if (value.name === "logout") {
        localStorage.removeItem("user_token");
      };
    }
  },

  mounted() {
    this.fetchJWT();
  }
}

</script>

<style>

  @import "./assets/css/normalize.css";
  @import "./assets/css/skeleton.css";
  @import "./assets/css/style.css";

/* #nav a {
  font-weight: bold;
  color: #2c3e50;
}

#navigation li a.router-link-exact-active {
  color: #f00;
} */

.right {
  text-align: right;
}

</style>
