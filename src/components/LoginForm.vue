<script setup>
  import { computed, onMounted, ref } from 'vue'

  import { onBeforeRouteLeave, useRouter } from 'vue-router'

  import { useAuthStore } from '@/store/auth.js'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputPassword from '@/components/formFields/InputPassword.vue'
  import InputUsername from '@/components/formFields/InputUsername.vue'

  const props = defineProps({
    formName: {
      type: String,
      default: 'Sign In'
    },
    submitButtonAction: {
      type: String,
      default: 'Sign In'
    }
  })

  const errorDescription = ref('')
  const errorTitle = ref('')
  const formValues = ref([])
  const isError = ref(false)

  const authStore = useAuthStore()
  const router = useRouter()

  onMounted(() => {
    authStore.loginPage = true
  })

  onBeforeRouteLeave((to, from) => {
    authStore.loginPage = false
  })

  const getFormErrorsChanged = () => {
    const formErrorsChanged = formValues.value.filter(element => {
      return element.isChanged !== false && element.isValid === false
    })
    return formErrorsChanged
  }

  const handleSubmit = async () => {
    const formErrors = getFormErrorsChanged()

    if (formErrors.length > 0) {
      updateFormErrors(formErrors)
      return
    } else {

      // Submit
      const data = {}

      formValues.value.forEach(element => {
        const { inputName, inputValue } = element
        data[inputName] = inputValue
      })

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/login`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        );

        const json = response.ok ? await response.json() : null

        if (json && json.status === 200) {
          const {
            data: { isLoggedIn, token }
          } = json;

          if (isLoggedIn && token) {
            authStore.currentJWT = token
            localStorage.setItem("user_token", token); // Needed to persist...
            authStore.start
            if (authStore.administrator) {
              router.push({ name: "adminDashboard" })
            } else {
              router.push({ name: "home" });
            }
          }
        } else {
          errorDescription.value = 'One or more required fields were not submitted to the server. Please try again in a few minutes.'
          errorTitle.value = 'Server Error'
          isError.value = true
        }
      } catch (error) {
        errorDescription.value = 'The server appears to be down. Please try again in a few minutes.'
        errorTitle.value = 'Server Error'
        isError.value = true
      }
    }
  }

  const removeFormValues = event => {
    const { inputName: name } = event
    const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
    formValues.value.splice(valuesIndex, 1) // Mutates formValues
    if (formValues.value.length === 0) { shouldClearInputs.value = false }
  }

  const updateFormValues = event => {
    const { inputName: name } = event
    const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
    if (valuesIndex === -1) {
      formValues.value.push(event)
    } else {
      formValues.value[valuesIndex] = event
    }
    const formErrors = getFormErrorsChanged()
    updateFormErrors(formErrors)
  }

  const updateFormErrors = formErrors => {
    if (formErrors.length > 0) {
      const errorMessages = formErrors.map(element => {
        return element.errorMessage
      })
      errorDescription.value = errorMessages.join('. ') + '.'

      const numberAgreement = formErrors.length === 1 ? 'An Error' : 'Errors'
      errorTitle.value = `The ${props.formName} Form Has ${numberAgreement}`

      isError.value = true
    } else {
      isError.value = false
      errorDescription.value = ''
      errorTitle.value = ''
    }
  }

  const isDisabled = computed(() => {
    const formErrors = getFormErrorsChanged()
    return formErrors.length > 0
  })
</script>

<template>
  <div class="login-form">
    <h5>
      {{ formName }}
    </h5>
    <div class="form-login-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <form>
      <InputUsername
        :required=true
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <InputPassword
        :required=true
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <button
        :disabled = "isDisabled"
        @click.prevent="handleSubmit"
        class="button-primary"
      >
        {{ submitButtonAction }}
      </button>
    </form>
    <p>
      <router-link to="/login/request-password-reset">
        Forgot your password?
      </router-link>
    </p>
  </div>
</template>
