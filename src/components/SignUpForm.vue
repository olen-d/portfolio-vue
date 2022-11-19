<script setup>
  import { computed, ref } from 'vue'

  import { useRouter } from 'vue-router'

  import { useAuthStore } from '@/store/auth.js'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputEmail from '@/components/formFields/InputEmail.vue'
  import InputNameFirst from '@/components/formFields/InputNameFirst.vue'
  import InputNameLast from '@/components/formFields/InputNameLast.vue'
  import InputPassword from '@/components/formFields/InputPassword.vue'
  import InputUsername from '@/components/formFields/InputUsername.vue'

  const props = defineProps({
    formName: {
      type: String,
      default: 'Sign Up'
    },
    submitButtonAction: {
      type: String,
      default: 'Sign Up'
    }
  })

  const errorDescription = ref('')
  const errorTitle = ref('')
  const formValues = ref([])
  const isError = ref(false)

  const authStore = useAuthStore()
  const router = useRouter()

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

      localStorage.removeItem('user_token')

      formValues.value.forEach(element => {
        const { inputName, inputValue } = element
        data[inputName] = inputValue
      })

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/create`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        )

        const json = response.ok ? await response.json() : null

        if (json && json.status === 201) {
          const {
            data: { isLoggedIn, token }
          } = json

          if (isLoggedIn && token) {
            authStore.currentJWT = token
            localStorage.setItem('user_token', token) // Needed to persist...
            if (authStore.administrator) {
              router.push({ name: 'adminDashboard' })
            } else {
              router.push({ name: 'home' })
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
  <div class="form-sign-up">
    <h5>
      {{ formName }}
    </h5>
    <form>
      <div class="form-sign-up-alert-error" v-if="isError">
        <AlertMessage :title="errorTitle" type="error">
          {{ errorDescription }}
        </AlertMessage>
      </div>
      <InputNameFirst @change-form-values="updateFormValues($event)"/>
      <InputNameLast @change-form-values="updateFormValues($event)" />
      <InputEmail @change-form-values="updateFormValues($event)" />
      <InputUsername @change-form-values="updateFormValues($event)" />
      <InputPassword @change-form-values="updateFormValues($event)" />
      <button
        :disabled="isDisabled"
        @click.prevent="handleSubmit"
        class="button-primary"
      >
        {{ submitButtonAction }}
      </button>
    </form>
  </div>
</template>
