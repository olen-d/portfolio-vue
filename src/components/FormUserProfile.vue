<script setup>
  // import { computed, ref } from vue
  import { onMounted, ref } from 'vue'
  // import { useStore } from vuex

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputNameFirst from '@/components/formFields/InputNameFirst.vue'
  import InputNameLast from '@/components/formFields/InputNameLast.vue'
  import InputEmail from '@/components/formFields/InputEmail.vue'
  import InputUsername from '@/components/formFields/InputUsername.vue'

  const username = 'olen.d' // Hardcoded for now, get it from the store when transition to composition API is complete

  const accessToken = ref('') // TODO: add authentication
  const emailAddress = ref('')
  const errorDescription = ref('')
  const errorTitle = ref('')
  const firstName = ref('')
  const formValues = ref([])
  const isError = ref(false)
  const isLoading = ref(true)
  const isSuccess = ref(false)
  const lastName = ref('')
  const successDescription = ref('')
  const successTitle = ref('')

  onMounted(async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${username}`)
      const result = await response.json()

      const { user: { email, firstName: first, lastName: last }, } = result
      emailAddress.value = email
      firstName.value = first
      lastName.value = last
      isLoading.value = false
    } catch (error) {
      console.log(error)
    }
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
      const changedFormValues = formValues.value.reduce((acc, element) => {
        if (element.isChanged) {
          const { inputName, inputValue } = element
          acc.push({ inputName, inputValue })
        }
        return acc
      }, [])
      changedFormValues.forEach(element => {
        const { inputName, inputValue } = element
        data[inputName] = inputValue
      })

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${username}`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const result = await response.json()
        const { status } = response

        if (status === 200 && result.status === 'ok') {
          successDescription.value = 'Your profile has been updated successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true
        }
        // TODO: Finish the error handling to address all cases
        if (status === 400 && result.message) {
          errorDescription.value = 'One or more required fields were not submitted to the server. Please try again in a few minutes.'
          errorTitle.value = 'Server Error'
          isError.value = true
        }
      } catch (error) {
        console.log(error)
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
      errorTitle.value = `The Profile Form Has ${numberAgreement}`

      isError.value = true
    } else {
      isError.value = false
      errorDescription.value = ''
      errorTitle.value = ''
    }
  }

</script>

<template>
  <div class="form-user-profile">
    <div class="form-user-profile-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="form-user-profile-alert-succes" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <form>
      <InputNameFirst v-if="!isLoading" :initialValue="firstName" @change-form-values="updateFormValues($event)"/>
      <InputNameLast v-if="!isLoading" :initialValue="lastName" @change-form-values="updateFormValues($event)" />
      <InputEmail v-if="!isLoading" :initialValue="emailAddress" @change-form-values="updateFormValues($event)" />
      <InputUsername v-if="!isLoading" :initialValue="username" @change-form-values="updateFormValues($event)" />
      <button class="button-primary" :disabled="isError" @click.prevent="handleSubmit">
        Update Profile
      </button>
    </form>
  </div>
</template>
