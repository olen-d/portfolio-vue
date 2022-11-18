<template>
  <div class="reset-password-form">
    <h5>
      Reset Password
    </h5>
    <p>
      Enter your new password below.
    </p>
    <InputPassword
      @send-password-value="handleSendPasswordValue"
      label="Password"
      placeholder="Your Password"
    >
    </InputPassword>
    <button
      @click="handleSubmit"
      class="button button-primary"
      :disabled="isDisabled"
    >
      {{ content }}
    </button>
  </div>
</template>

<script>
import InputPassword from "./formFields/InputPassword.vue";

export default {
  components: {
    InputPassword,
  },

  props: {
    content: {
      default: "Reset Password",
      type: String
    },
    token: {
      required: true,
      type: String
    }
  },

  data: () => {
    return { password: "" };
  },

  computed: {
    isDisabled() {
      return this.password.length > 0 ? false : true;
    }
  },

  methods: {
    handleSendPasswordValue(event, value) {
      this.password = value;
    },

    handleSubmit() {
      // ! TODO: Check for errors
      this.postRequest();
    },

    async postRequest() {
      const { password, token } = this;

      const formData = { password, token };

      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/users/password/reset`,
          {
            method: "put",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
          }
        );

        const json = response.ok ? await response.json() : null;

        if (json && json.status === 200) {
          this.$store.commit("setStatusCategory", "success");
          this.$store.commit(
            "setStatusMessage",
            "Your password was successfully reset and you can now login using your new password."
          );
        } else {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit(
            "setStatusMessage",
            "Invalid password. Please enter a valid password and try again."
          );
        }
      } catch (error) {
        this.$store.commit("setStatusCategory", "error");
        this.$store.commit(
          "setStatusMessage",
          `Something went terribly awry. Please check the password you entered and try again. ${error}`
        );
      }
    }
  }
};
</script>
