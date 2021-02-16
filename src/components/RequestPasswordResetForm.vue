<template>
  <div class="request-password-reset-form">
    <h5>
      Request Password Reset
    </h5>
    <Message
      v-bind:messageContent="[
        'Enter your email address below and we\'ll email you a link with instructions to reset your password.'
      ]"
    >
    </Message>
    <InputEmail
      @send-email-value="handleSendEmailValue"
      label="Email Address"
      placeholder="Your Email Address"
    >
    </InputEmail>
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
import InputEmail from "./formFields/InputEmail.vue";
import Message from "./Message.vue";

export default {
  components: {
    InputEmail,
    Message
  },

  props: {
    content: {
      default: "Request Password Reset",
      type: String
    }
  },

  data: () => {
    return { email: "" };
  },

  computed: {
    isDisabled() {
      return this.email.length > 0 ? false : true;
    }
  },

  methods: {
    handleSendEmailValue(event, value) {
      this.email = value;
    },

    handleSubmit() {
      // ! TODO: Check for errors
      this.postRequest();
    },

    async postRequest() {
      const { email } = this;
      const formData = { email };

      try {
        const response = await fetch(
          `${process.env.VUE_APP_API_BASE_URL}/api/users/reset/password`,
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
          this.$store.commit("setStatusCategory", "success");
          this.$store.commit(
            "setStatusMessage",
            "A message with instructions to reset your password was successfully sent to the email address you entered."
          );
        } else {
          this.$store.commit("setStatusCategory", "error");
          this.$store.commit(
            "setStatusMessage",
            "Invalid email. Please check the email address you entered and try again."
          );
        }
      } catch (error) {
        this.$store.commit("setStatusCategory", "error");
        this.$store.commit(
          "setStatusMessage",
          `Something went terribly awry. Please check the email address you entered and try again. ${error}`
        );
      }
    }
  }
};
</script>
