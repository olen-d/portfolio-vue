<template>
  <div class="admin-form-headline">
    <form>
      <TextareaHeadline
        :defaultValue="defaultHeadlineValue"
        @update-form-value = "updateFormValue"
      />
      <div class="right">
        <button v-on:click.prevent="submitForm" class="button-primary" id="headline-submit">{{ formAction }} Headline</button>
      </div>
    </form>
  </div>
</template>

<script>
import { mapGetters } from "vuex";

import TextareaHeadline from "@/components/formFields/TextareaHeadline.vue"

export default({
  name: "AdminFormHeadline",

  components: { TextareaHeadline },

  props: {
    contentId: {
      default: '',
      type: String
    },
    defaultValue: {
      default:'',
      type: String
    },
    formAction: {
      default: "Add",
      type: String
    }
  },

  data: () => {
    return {
      defaultHeadlineValue: '',
      formValues: [],
      headlineId: ''
    }
  },

  computed: {
    ...mapGetters([
      "jwt"
    ])
  },

  watch: {
    contentId(newValue) {
      if(this.formAction === "Update") {
        this.headlineId = newValue
      }
    },
  
    defaultValue(newValue) {
      if (this.formAction === "Update") {
        this.defaultHeadlineValue = newValue
      }
    }
  },

  methods: {
    createHeadline (formData) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/welcome/headline`,
        {
          method: "post",
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      )
        .then(response => {
          return response.json();
        })
        .then(dataObj => {
          console.log("DATA OBJ\n", dataObj);
        });
    },

    submitForm () {
      // TODO: Fix this later, should loop through all the inputs
      const inputName = "headline"
      const userId = this.$store.getters.userId;
      const headlineIndex = this.formValues.findIndex(element => element.inputName === inputName)
      const { [headlineIndex]: { inputValue: headline } } = this.formValues

      if( this.formAction === "Add") {
        const formData = {
          userId,
          headline
        }
        this.createHeadline(formData)
      } else if ( this.formAction === "Update") {
        const headline_id = this.headlineId

        const formData = {
          headline_id,
          headline
        }
        this.updateHeadline(formData)
      }
    },

    updateFormValue (event, inputName, isError, payload) {
      const valuesIndex = this.formValues.findIndex(element => element.inputName === inputName)
      if (valuesIndex === -1) {
        this.formValues.push({ inputName, inputValue: payload, isError })
      } else {
        this.formValues[valuesIndex] = { inputName, inputValue: payload, isError }
      }
      // const formErrors = submitState.isSubmitted ? getFormErrors() : getFormErrorsChanged()
      // updateFormErrors(formErrors)
    },

    updateHeadline (formData) {
      const headline_id = this.headlineId
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/welcome/update/headline/${headline_id}`,
        {
          method: "put",
          headers: {
            Authorization: `Bearer ${this.jwt}`,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(formData)
        }
      )
        .then(response => {
          return response.json();
        })
        .then(dataObj => {
          console.log("DATA OBJ\n", dataObj);
        });
    }
  }
})
</script>
