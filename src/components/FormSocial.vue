<script setup>
  import { ref } from 'vue'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputAnchor from '@/components/formFields/InputAnchor.vue'
  import InputIcon from '@/components/formFields/InputIcon.vue'
  import InputOrder from '@/components/formFields/InputOrder.vue'
  import InputURI from '@/components/formFields/InputURI.vue'

  const emits = defineEmits(['socialMediaLinkCreated'])

  const username = 'olen.d' // Hardcoded for now, get it from the store when transition to composition API is complete

  const accessToken = ref('') // TODO: add authentication
  const errorDescription = ref('')
  const errorTitle = ref('')
  const formValues = ref([])
  const isError = ref(false)
  const isSuccess = ref(false)
  const successDescription = ref('')
  const successTitle = ref('')
  const shouldClearInputs = ref(false)

  const clearForm = () => {
    // Remove the username, otherwise shouldClearInputs won't reset to false because 
    // removeFormValues is never called as username is not associated with an input component
    const valuesIndex = formValues.value.findIndex(element => element.inputName === 'username')
    formValues.value.splice(valuesIndex, 1) // Mutates formValues

    shouldClearInputs.value = true
  }

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
      // Add the username here, otherwise it causes issues with form clearing because it is not associated with an input component
      formValues.value.push({ inputName: "username", inputValue: username, isChanged: true, isValid: true, errorMessage: null })

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
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/social`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken.value}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(data)
        })
        const result = await response.json()
        const { status } = response
        const { result: insertResult } = result 

        if (status === 200) {
          emits('socialMediaLinkCreated', insertResult)
          successDescription.value = 'The social media link was added successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true
          clearForm()
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
      errorTitle.value = `The Social Media Form Has ${numberAgreement}`

      isError.value = true
    } else {
      isError.value = false
      errorDescription.value = ''
      errorTitle.value = ''
    }
  }
</script>

<template>
  <div class="form-social">
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
      <InputIcon
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputAnchor
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <InputURI
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <InputOrder
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)"
        @remove-form-values="removeFormValues($event)"
      />
      <div class="right">
        <button @click.prevent="handleSubmit" class="button-primary" id="social-submit">Add Social Media Link</button>
        <!-- <button v-if="formAction === 'Edit'" v-on:click.prevent="cancelEditSkill" class="edit-button-cancel">cancel</button> -->
      </div>
    </form>
  </div>
</template>
