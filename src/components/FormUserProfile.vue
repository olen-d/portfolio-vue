<script setup>
  import { onMounted, ref } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputNameFirst from '@/components/formFields/InputNameFirst.vue'
  import InputNameLast from '@/components/formFields/InputNameLast.vue'
  import InputEmail from '@/components/formFields/InputEmail.vue'
  import InputUsername from '@/components/formFields/InputUsername.vue'

  const props = defineProps({
    editId: {
      default: null,
      type: String
    },
    formAction: {
      default: 'add',
      type: String
    },
    updateData: {
      type: Object
    }
  })

  const authStore = useAuthStore()

  const accessToken = ref(authStore.currentJWT) // TODO: add authentication
  const errorDescription = ref('')
  const errorTitle = ref('')
  const formValues = ref([])
  const isError = ref(false)
  const isSuccess = ref(false)
  const successDescription = ref('')
  const successTitle = ref('')

  onMounted(async () => {
    //
  })

  const createUserProfile = data => {
    //
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

      if (props.formAction === 'add') {
        createUserProfile(data)
      } else if (props.formAction === 'edit') {
        updateUsrProfile(data)
      } else {
        errorDescription.value = 'An invalid action was submitted and no data was sent to the server.'
        errorTitle.value = 'Internal Error'
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
      errorTitle.value = `The Profile Form Has ${numberAgreement}`

      isError.value = true
    } else {
      isError.value = false
      errorDescription.value = ''
      errorTitle.value = ''
    }
  }

const updateUsrProfile = async data => {
  try {
    const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/id/${props.editId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
    const result = await response.json()
    const { status } = response

    if (status === 200) {
      const { n, ok } = result 

      if(n === 1 && ok === 1) {
        successDescription.value = 'Your profile has been updated successfully'
        successTitle.value = 'Great Success'
        isSuccess.value = true
      } else {
        errorDescription.value = 'Your profile was not updated.'
        errorTitle.value = 'Database Error'
        isError.value = true
      }
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
      <InputNameFirst :initialValue="updateData.firstName || null" @change-form-values="updateFormValues($event)"/>
      <InputNameLast :initialValue="updateData.lastName || null" @change-form-values="updateFormValues($event)" />
      <InputEmail :initialValue="updateData.email || null" @change-form-values="updateFormValues($event)" />
      <InputUsername :initialValue="updateData.username || null" @change-form-values="updateFormValues($event)" />
      <div class="right">
        <button class="button-primary" :disabled="isError" @click.prevent="handleSubmit">
          Update Profile
        </button>
      </div>
    </form>
  </div>
</template>
