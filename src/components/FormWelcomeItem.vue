<script setup>
  import { ref, watch } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputOrder from '@/components/formFields/InputOrder.vue'
  import InputTitle from '@/components/formFields/InputTitle.vue'
  import SelectBinary from '@/components/formFields/SelectBinary.vue'
  import TextareaGeneric from '@/components/formFields/TextareaGeneric.vue'

  const emits  = defineEmits(['cancelEditWelcomeItem', 'welcomeItemCreated', 'welcomeItemUpdated'])

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
  const shouldClearInputs = ref(false)
  const successDescription = ref('')
  const successTitle = ref('')
  const totalFields = ref(0)

  const cancelEditWelcomeItem = () => {
    clearForm()
    emits('cancelEditWelcomeItem')
  }

  const clearForm = () => {
    totalFields.value = formValues.value.length
    shouldClearInputs.value = true
  }

  const createWelcomeItem = async data => {
    data.createdBy = authStore._id

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/welcome`, { // TODO: Fix the route on the backend, was originally /api/welcome/headline
        method: 'post',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      const { status } = response

      if (status === 200) {
        const { _id } = result

        if (_id) {
          clearForm()
          successDescription.value = 'The welcome item was added successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true
          emits('welcomeItemCreated', result)
        } else {
          errorDescription.value = 'Welcome item was not created.'
          errorTitle.value = 'Database Error'
          isError.value = true
        }
      } else {
        errorDescription.value = 'Welcome item was not created.'
        errorTitle.value = 'Server Error'
        isError.value = true
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

  const getFormErrorsChanged = () => {
    const formErrorsChanged = formValues.value.filter(element => {
      return element.isChanged !== false && element.isValid === false
    })
    return formErrorsChanged
  }

  const handleSubmit = () => {
    const formErrors = getFormErrorsChanged()

    if (formErrors.length > 0) {
      updateFormErrors(formErrors)
      return
    } else {
      // Submit

      const changedFormValues = formValues.value.reduce((acc, element) => {
        if (element.isChanged) {
          const { inputName, inputValue } = element
          acc.push({ inputName, inputValue })
        }
        return acc
      }, [])

      const data = {}
      changedFormValues.forEach(element => {
        const { inputName, inputValue } = element
        data[inputName] = inputValue
      })

      if (props.formAction === 'add') {
        createWelcomeItem(data)
      } else if (props.formAction === 'edit') {
        updateWelcomeItem(data)
      } else {
        errorDescription.value = 'An invalid action was submitted and no data was sent to the server.'
        errorTitle.value = 'Internal Error'
        isError.value = true
      }
    }
  }

  const removeFormValues = event => {
    const { inputName: name } = event
    const valuesIndex = formValues.value.findIndex(element => element.inputName === name)
    formValues.value[valuesIndex] = event

    totalFields.value = totalFields.value - 1
    if (totalFields.value === 0) { shouldClearInputs.value = false }
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
      errorTitle.value = `The Welcome Item Form Has ${numberAgreement}`

      isError.value = true
    } else {
      isError.value = false
      errorDescription.value = ''
      errorTitle.value = ''
    }
  }

  const updateWelcomeItem = async data => {
    try {
      data.updatedBy = authStore._id

      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/welcome/${props.editId}`, { // TODO: Fix the route on the backend, was originally /api/welcome/update/headline/ and PUT, should be PATCH
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
      const result = await response.json()
      const { status } = response

      if (status === 200) {
        const { n, ok } = result 

        if(n === 1 && ok === 1) {
          clearForm()
          successDescription.value = 'The welcome item was updated successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true
          emits('welcomeItemUpdated', props.editId)
        } else {
          errorDescription.value = 'Welcome item was not updated.'
          errorTitle.value = 'Database Error'
          isError.value = true
        }
      } else {
        errorDescription.value = 'Welcome item was not updated.'
        errorTitle.value = 'Server Error'
        isError.value = true
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

  watch(() => props.formAction, (newFormAction, prevFormAction) => {
    if (newFormAction === 'add') { clearForm() }
  })
</script>

<template>
  <div class="form-welcome-item">
    <h3 class="form-welcome-item-title">
      {{ formAction }} a Welcome Item
    </h3>
    <div class="form-welcome-item-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="form-welcome-item-alert-success" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <form>
      <InputTitle
        errorMessage="Please enter a valid welcome item title"
        inputName="title"
        labeltext="Title"
        placeholder="Enter a title..."
        :initialValue="updateData.title || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <TextareaGeneric
        errorMessage="Please enter valid content"
        inputName="content"
        labeltext="Content"
        placeholder="Write some attention grabbing content..."
        :initialValue="updateData.content || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputOrder
        errorMessage="Please enter a valid sort priority"
        inputName="priority"
        labeltext="Sort Priority"
        placeholder="Enter number..."
        :initialValue="updateData.priority || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <SelectBinary
        errorMessage="Please choose an option under Display Welcome Item"
        inputName="show"
        labeltext="Display Welcome Item?"
        :initialValue="updateData.show || ''"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <div class="right">
        <button 
          class="button-primary"
          @click.prevent="handleSubmit"
        >
            {{ formAction }} Welcome Item
          </button>
          <button v-if="formAction === 'edit'" @click.prevent="cancelEditWelcomeItem" class="edit-button-cancel">cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .edit-button-cancel {
    margin-left: 1rem;
  }
  .form-welcome-item-title {
    text-transform: capitalize;
  }
</style>
