<template>
  <div id="app">
    <Navbar></Navbar>
    <StatusBar v-if="statusCategory && statusMessage">
    </StatusBar>
    <router-view></router-view>
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
              <router-link to="/login" v-if="!authorized && !$store.getters.loginPage" class="ntd">Login</router-link>&nbsp;<router-link to="/signup" v-if="!$store.getters.authorized && !$store.getters.signupPage" class="ntd">Signup</router-link>
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
import StatusBar from "./components/StatusBar.vue";

export default {
  name: "app",
  store,
  components: {
    Navbar,
    Social,
    StatusBar
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
      "editor",
      "expiration",
      "authorized"
    ]),

    ...mapState([
      "doLogout",
      "statusCategory",
      "statusMessage"
    ])
   },

  watch: {
    doLogout: function(newValue) {
      if(newValue) {
        this.logout();
      }
    },
    
    authorized: function(newValue) {
      if(!newValue) {
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
    this.$store.dispatch("start");
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
