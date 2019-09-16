<template>
  <div id="app">
    <Navbar />
      <div class="logo-header">
        <img src="/assets/images/OD_min_500x500.png" width="200px" height="200px" />
      </div>
            <pre>
              JWT: {{jwtData}}
            </pre>
            <p></p>
            <pre>
              State: {{state.userName}}
            </pre>
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

import Navbar from "./components/Navbar.vue";
import Social from "./components/Social.vue";

export default {
  name: 'app',

  components: {
    Navbar,
    Social
  },

  // Set up the data to hold the login information
  // TODO: Update this to use Vuex in the future as
  // the application gets more complex

  data: () => {
    return {
      jwt: "",
      // userToken: "",
      debug: true,
      state: []
    } 
  },

  created: () => {
    let state = {
      userId: "",
      userName: "",
      firstName: "",
      lastName: "",
      administrator: false,
      editor: false,
      loggedIn: false,
      redirect: false,
      };
  
    return state;
  },

  computed: {
    jwtData() {
    if (this.jwt) return JSON.parse(atob(this.jwt.split(".")[1]));
    return {};
    }
  },

  methods: {
    async fetchJWT() {
      // TODO: Add error handling

      const res = await localStorage.getItem("user_token");
      this.jwt = await res;
      this.setStateAction("userId", this.jwtData.userId);
      this.setStateAction("userName", this.jwtData.userName);
      this.setStateAction("firstName", this.jwtData.firstName);
      this.setStateAction("lastName", this.jwtData.lastName);
      this.setStateAction("administrator", this.jwtData.administrator);
      this.setStateAction("editor", this.jwtData.editor);
      this.setStateAction("loggedIn", this.jwtData.loggedIn);
      this.setStateAction("redirect", this.jwtData.redirect);
      console.log("xxyyyzzyy\n", this.state.lastName);
      console.log("lllllllll\n", this.jwtData);
      console.log("CHICKENPOTPIE\n",this.state);
      // console.log("LOCALSTORAGE\n",localStorage.user_token);
    },

    setStateAction(key, newValue) {
      if (this.debug) {
        console.log(key, " Triggered");
      }
      this.state[key] = newValue;
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
