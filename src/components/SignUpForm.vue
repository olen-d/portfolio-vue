<template>
  <form id="signUpForm">
    <label for="firstName">First Name</label>
    <input v-model="signupData.firstName" type="text" class="u-full-width" id="firstName" placeholder="Your First Name" required>
    <label for="lastName">Last Name</label>
    <input v-model="signupData.lastName" type="text" class="u-full-width" id="lastName" placeholder="Your Last Name" required>
    <label for="email">Email Address</label>
    <input v-model="signupData.email" type="email" class="u-full-width" id="email" placeholder="Your Email Address" required>
    <label for="userName">Username</label>
    <input v-model="signupData.userName" type="text" class="u-full-width" id="userName" placeholder="Your Username" required>
    <label for="password">Password</label>
    <input v-model="signupData.password" type="password" class="u-full-width" id="password" placeholder="Your Password" required>
    <button v-on:click.prevent="submitSignUpForm" type="submit" class="button-primary" id="signIn">Sign Up</button>
  </form>
</template>

<script>
export default {
  data: () => {
    return {
      signupData: {
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

      const { firstName, lastName, email, userName, password } = this.signupData;
      // TODO: Validate this mess

      const formData = {
        firstName: firstName,
        lastName: lastName,
        email: email,
        userName: userName,
        password: password
      }

      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/users/create`, {
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
