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
              <router-link to="/login" v-if="!$store.getters.authorized && !$store.getters.loginPage" class="ntd">Login</router-link>&nbsp;<router-link to="/signup" v-if="!$store.getters.authorized && !$store.getters.signupPage" class="ntd">Signup</router-link>
            </p>
          </div>
        </div>
      </div>
		</div>
  </div>
</template>

<script>
import { mapGetters, mapState, mapActions } from "vuex";
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
    ]),

    ...mapState([
      "doLogout"
    ])
  },

  watch: {
    doLogout: function(newValue) {
      if(newValue) {
        this.logout();
      }
    } 
  },

  methods: {
    ...mapActions([
      "fetchJWT"
    ]),

    logout () {
      this.$store.dispatch("logout");
      localStorage.removeItem("user_token");
      this.$router.push({ name: "home" })
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

.ntd {
  text-decoration: none;
}

</style>
