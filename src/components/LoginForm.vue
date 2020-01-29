<template>
  <div id="login-form-container">
    <form id="login-form">
      <label for="name">Username</label>
      <input
        v-model="form.username"
        type="text"
        class="u-full-width"
        id="name"
        placeholder="Your Username"
        required
      />
      <label for="password">Password</label>
      <input
        v-model="form.password"
        type="password"
        class="u-full-width"
        id="password"
        placeholder="Your Password"
        required
      />
      <button
        v-on:click.prevent="submitLoginForm"
        class="button-primary"
        id="signIn"
      >
        Sign In
      </button>
    </form>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      form: {
        username: null,
        password: null
      }
    };
  },

  methods: {
    submitLoginForm() {
      const { username, password } = this.form;
      const formData = {
        username,
        password
      };

      fetch(`${process.env.VUE_APP_API_BASE_URL}/api/users/login`, {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(formData)
      })
        .then(response => {
          return response.json();
        })
        .then(dataObj => {
          if (dataObj.isLoggedIn && dataObj.token) {
            this.$store.commit("setJWT", dataObj.token);
            localStorage.setItem("user_token", dataObj.token); // Needed to persist...
            this.$store.dispatch("start");
            if (this.$store.getters.administrator) {
              this.$router.push({ name: "adminDashboard" });
            } else {
              this.$router.push({ name: "home" });
            }
          }
        });
    }
  }
};
</script>
