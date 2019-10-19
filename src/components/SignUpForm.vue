<template>
  <form id="signUpForm">
    <label for="firstName">First Name</label>
    <input v-model="form.firstName" type="text" class="u-full-width" id="firstName" placeholder="Your First Name" required>
    <label for="lastName">Last Name</label>
    <input v-model="form.lastName" type="text" class="u-full-width" id="lastName" placeholder="Your Last Name" required>
    <label for="email">Email Address</label>
    <input v-model="form.email" type="email" class="u-full-width" id="email" placeholder="Your Email Address" required>
    <label for="userName">Username</label>
    <input v-model="form.userName" type="text" class="u-full-width" id="userName" placeholder="Your Username" required>
    <label for="password">Password</label>
    <input v-model="form.password" type="password" class="u-full-width" id="password" placeholder="Your Password" required>
    <button v-on:click.prevent="submitSignUpForm" type="submit" class="button-primary" id="signIn">Sign Up</button>
  </form>
</template>

<script>
export default {
  data: () => {
    return {
      form: {
        firstName: "",
        lastName: "",
        email: "",
        userName: "",
        password: ""
      }
    }
  },

  methods: {
    submitSignUpForm () {
      localStorage.removeItem("user_token");

      // TODO: Destructure form data
      // TODO: Validate this mess

      let formData = {
        firstName: this.form.firstName,
        lastName: this.form.lastName,
        email: this.form.email,
        userName: this.form.userName,
        password: this.form.password
      }

      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/user/create`, {
      method: "post",
      headers: {
        "Content-Type": "application/json"
      },
        body: JSON.stringify(formData)
      }).then(response => {
        return response.json();
      }).then(dataObj => {
        if (dataObj.isLoggedIn && dataObj.token) {
          this.$store.commit("setJWT", dataObj.token);
          this.$store.commit("setAuthorized", true);
          localStorage.setItem("user_token", dataObj.token); // Needed to persist...
          if (this.$store.getters.administrator) {
            this.$router.push({ name: "adminDashboard" });
          } else {
            this.$router.push({ name: "home" });
          }
        } else {
            // Something went horribly wrong
            // TODO: Provide some sort of intelligent error and update the UI with it
        }
      }).catch(error => {
        return ({
          errorCode: 500,
          errorMsg: "Internal Server Error",
          errorDetail: error
        })
      });
    }
  }
}
</script>
