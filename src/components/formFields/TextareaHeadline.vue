<template>
  <div class="textarea-headline">
    <label for="headline">{{ label }}</label>
    <textarea class="u-full-width" id="headline" name="headline" v-model="inputData.headline" v-on:blur="handleBlur" :placeholder="placeholder"></textarea>
  </div>
</template>

<script>
  export default {
    name: "TextareaHeadline",
    props: {
      defaultValue: {
        type: String
      },
      errorMessage: {
        default: "Please enter a valid headline.",
        type: String
      },
      formAction: {
        type: String
      },
      label: {
        default: "Headline",
        type: String
      },
      method: { type: Function },
      placeholder: {
        default: "Write an attention grabbing headline...",
        type: String
      }
    },

    data: () => {
      return {
        inputData: { headline: "" },
        isError: false
      };
    },
  
    watch: {
      defaultValue(newValue) {
        this.inputData.headline = newValue
      }
    },
  
    methods: {
      handleBlur() {
        const isValid = this.validate()
        if (isValid) {
          this.isError = false
        } else {
          this.isError = true
        }

        this.$emit("update-form-value", "blur", "headline", this.isError, this.inputData.headline)
      },

      validate() {
        const {
          inputData: { headline }
        } = this;
 
        if (headline && headline.length > 0) {
          return true;
        } else {
          return false;
        }
      }
    },

    mounted() {
      this.inputData.headline = this.defaultValue
    }
  };
  </script>
