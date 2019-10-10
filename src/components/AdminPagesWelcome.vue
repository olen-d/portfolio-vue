<template>
  <div id="admin-pages-welcome">
    <div class="container">
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <h3>
            Welcome
          </h3>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
      <div class="row">
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <form id="headline-form">
            <label for="headline">Headline</label>
            <textarea class="u-full-width" id="headline" v-model="welcome.headline" placeholder="Write an attention grabbing headline..."></textarea>
            <div class="right">
              <button v-on:click.prevent="submitHeadlineForm" class="button-primary" id="headline-submit">Update Headline</button>
            </div>
          </form>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  name: "AdminPagesWelcome",

  data: () => {
    return {
      welcome: [],
    }
  },

  computed: {
    ...mapGetters([ "firstName" ])
  },

  methods: {
    submitHeadlineForm () {
      const formData = {
        headline: this.welcome.headline,
      }

      // fetch("http://localhost:3031/api/login", {
      //   method: "post",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(formData)
      // }).then(response => {
      //   return response.json();
      // }).then(dataObj => {
        // if(dataObj.isLoggedIn && dataObj.token) {
        //   this.$store.commit("setJWT", dataObj.token);
        //   this.$store.commit("setAuthorized", true);
        //   localStorage.setItem("user_token", dataObj.token); // Needed to persist...
        //   if (this.$store.getters.administrator) {
        //     this.$router.push({ name: "adminDashboard" });
        //   } else {
        //     this.$router.push({ name: "home" });
        //   }
        // }
      // });
    } 
  },

  created() {
    fetch("https://www.olen.dev/api/welcome")
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        this.welcome = json.welcome['0'];
    });
  }
}
</script>

<style scoped>
textarea {
  height:16rem;
}
</style>