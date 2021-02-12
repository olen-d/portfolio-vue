<template>
  <div class="input-email">
    <label for="email" v-bind:class="{ 'text-error': isError }">
      Email Address
    </label>
    <input
      v-model="inputEmailData.email"
      v-on:blur="handleBlur"
      type="email"
      class="u-full-width"
      id="email"
      placeholder="Your Email Address"
      required
    />
  </div>
</template>

<script>
export default {
  props: {
    method: { type: Function }
  },

  data: () => {
    return {
      inputEmailData: { email: "" },
      isError: false
    };
  },

  methods: {
    async handleBlur() {
      const isValid = await this.validate();
      if (!isValid) {
        this.$store.commit("setStatusCategory", "error");
        this.$store.commit(
          "setStatusMessage",
          "Invalid email. Please enter a valid email address in the format: name@example.com and try again."
        );
        this.isError = true;
      } else {
        this.$store.commit("setStatusCategory", "");
        this.$store.commit("setStatusMessage", "");
        this.isError = false;
      }

      this.$emit("send-email-value", "blur", this.inputEmailData.email);
    },

    async validate() {
      const expression = /.+@.+\..+/i;
      const {
        inputEmailData: { email }
      } = this;

      if (expression.test(String(email).toLowerCase())) {
        try {
          const result = await fetch(
            `${process.env.VUE_APP_API_BASE_URL}/api/mail/check-mx/${email}`
          );
          const data = await result.json();
          const { mxExists } = data;

          return mxExists ? true : false;
        } catch {
          return false;
        }
      } else {
        return false;
      }
    }
  }
};
</script>
