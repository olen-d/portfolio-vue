<template>
  <div class="input-password">
    <label for="email" v-bind:class="{ 'text-error': isError }">
      {{ label }}
    </label>
    <input
      v-model="inputData.password"
      v-on:blur="handleBlur"
      type="password"
      class="u-full-width"
      id="password"
      v-bind:placeholder="placeholder"
      required
    />
  </div>
</template>

<script>
export default {
  props: {
    label: {
      default: "Password",
      type: String
    },
    method: { type: Function },
    placeholder: {
      default: "Your Password",
      type: String
    }
  },

  data: () => {
    return {
      inputData: { password: "" },
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
          "Invalid password. Please enter a password at least eight characters long, with one uppercase and one lowecase letter and at least one number or special character."
        );
        this.isError = true;
      } else {
        this.$store.commit("setStatusCategory", "");
        this.$store.commit("setStatusMessage", "");
        this.isError = false;
      }

      this.$emit("send-password-value", "blur", this.inputData.password);
    },

    /**
     * Validate that a potential password meets minimum requirements
     * @author Olen Daelhousen <matchr@olen.dev>
     * @param {string} password - the password to be tested
     * @returns {Promise} Promise object represents true if the password passes validation or false if not
     */

    validate() {
      return new Promise((resolve, reject) => {
        const {
          inputData: { password }
        } = this;

        try {
          const oneUpper = /[A-Z]/;
          const oneLower = /[a-z]/;
          const oneDigit = /\d/;
          const oneSpecial = /[!@#$%^&*()-+=]/;

          const isOneUpper = oneUpper.test(password);
          const isOneLower = oneLower.test(password);
          const isOneDigit = oneDigit.test(password);
          const isOneSpecial = oneSpecial.test(password);
          const isLength = password && password.length >= 8; // Short circuit to avoid promise rejection if null or undefined password is passed

          if (
            isOneUpper &&
            isOneLower &&
            (isOneDigit || isOneSpecial) &&
            isLength
          ) {
            resolve(true);
          } else {
            resolve(false);
          }
        } catch {
          reject(false);
        }
      });
    }
  }
};
</script>
