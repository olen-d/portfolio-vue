<script setup>
  import { computed, ref } from 'vue'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputEmail from '@/components/formFields/InputEmail.vue'

  const props = defineProps({
    formName: {
      type: String,
      default: 'Request Password Reset'
    },
    submitButtonAction: {
      type: String,
      default: 'Request Password Reset'
    }
  })

  const errorDescription = ref('')
  const errorTitle = ref('')
  const formValues = ref([])
  const isError = ref(false)
  const isSuccess = ref(false)
  const successDescription = ref('')
  const successTitle = ref('')

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
      const data = {}

      formValues.value.forEach(element => {
        const { inputName, inputValue } = element
        data[inputName] = inputValue
      })

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/users/reset/password`,
          {
            method: "post",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
          }
        )

        const json = response.ok ? await response.json() : null

        if (json && json.status === 200) {
          successDescription.value = 'A message with instructions to reset your password was successfully sent to the email address you entered.'
          successTitle.value = 'Great Success'
          isSuccess.value = true
        } else {
          errorDescription.value = 'One or more required fields were not submitted to the server. Please try again in a few minutes.'
          errorTitle.value = 'Server Error'
          isError.value = true
        }
      } catch (error) {
        console.log(JSON.stringify(error))
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
  <div class="form-request-password-reset">
    <h5>
      {{ formName }}
    </h5>
    <div class="form-request-password-reset-success" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <div class="form-request-password-reset-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="form-request-password-reset-default">
      <p>
        Enter your email address below and we'll email you a link with instructions to reset your password.
      </p>
    </div>
    <InputEmail @change-form-values="updateFormValues($event)" />
    <button
        :disabled="isDisabled"
        @click.prevent="handleSubmit"
        class="button-primary"
      >
        {{ submitButtonAction }}
      </button>
  </div>
</template>
