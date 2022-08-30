<template>
  <div id="login-form-container">
    <h5>
      Sign In
    </h5>
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
        :disabled="isDisabled"
        id="signIn"
      >
        Sign In
      </button>
    </form>
    <p>
      <router-link to="/login/request-password-reset">
        Forgot your password?
      </router-link>
    </p>
  </div>
</template>

<script>
export default {
  data: () => {
    return {
      form: {
        username: "",
        password: ""
      }
    };
  },

  computed: {
    isDisabled() {
      const {
        form: { username, password }
      } = this;
      return username.length > 0 && password.length > 0 ? false : true;
    }
  },

  methods: {
    async submitLoginForm() {
      const { username, password } = this.form;
      const formData = {
        username,
        password
      };

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          }
        );

        const json = response.ok ? await response.json() : null;

        if (json && json.status === 200) {
          const {
            data: { isLoggedIn, token }
          } = json;

          if (isLoggedIn && token) {
            this.$store.commit("setJWT", token);
            localStorage.setItem("user_token", token); // Needed to persist...
            this.$store.dispatch("start");
            if (this.$store.getters.administrator) {
              this.$router.push({ name: "adminDashboard" });
            } else {
              this.$router.push({ name: "home" });
            }
          }
        } else {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit(
            "setStatusMessage",
            "Unable to sign in. Please check the username and password you entered and try again."
          );
        }
      } catch (error) {
        this.$store.commit("setStatusCategory", "error");
        this.$store.commit(
          "setStatusMessage",
          "The server appears to be down. Please try again later."
        );
      }
    }
  },

  mounted() {
    this.$store.commit("setLoginPage", true);
  },

  beforeRouteLeave (to, from, next) {
    this.$store.commit("setLoginPage", false);
    next();
  }
};
</script>
