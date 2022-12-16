<script setup>
  import { ref, watch } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputIcon from '@/components/formFields/InputIcon.vue'
  import InputOrder from '@/components/formFields/InputOrder.vue'
  import InputTitle from '@/components/formFields/InputTitle.vue'
  import InputSkillType from '@/components/formFields/InputSkillType.vue'
  import SelectBinary from '@/components/formFields/SelectBinary.vue'
  import TextareaGeneric from '@/components/formFields/TextareaGeneric.vue'

  const emits  = defineEmits(['cancelEditSkill', 'skillCreated', 'skillUpdated'])

  const props = defineProps({
    formAction: {
      type: String,
      default: 'add'
    },
    editSkillId: {
      type: String
    },
    updateSkillData: {
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

  const cancelEditSkill = () => {
    clearForm()
    emits('cancelEditSkill')
  }

  const clearForm = () => {
    totalFields.value = formValues.value.length
    shouldClearInputs.value = true
  }

  const createSkill = async data => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/create`, {
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
            successDescription.value = 'The skill was added successfully'
            successTitle.value = 'Great Success'
            isSuccess.value = true
            emits('skillCreated', result)
          } else {
            errorDescription.value = 'Skill was not created.'
            errorTitle.value = 'Database Error'
            isError.value = true
          }
        } else {
          errorDescription.value = 'Skill was not created.'
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

      const data = {'userId': authStore._id}
      changedFormValues.forEach(element => {
        const { inputName, inputValue } = element
        data[inputName] = inputValue
      })

      if (props.formAction === 'add') {
        createSkill(data)
      } else if (props.formAction === 'edit') {
        updateSkill(data)
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
      errorTitle.value = `The Skills Form Has ${numberAgreement}`

      isError.value = true
    } else {
      isError.value = false
      errorDescription.value = ''
      errorTitle.value = ''
    }
  }

  const updateSkill = async data => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/update/${props.editSkillId}`, {
        method: 'put',
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
          successDescription.value = 'The skill was updated successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true
          emits('skillUpdated', props.editSkillId)
        } else {
          errorDescription.value = 'Skill was not updated.'
          errorTitle.value = 'Database Error'
          isError.value = true
        }
      } else {
        errorDescription.value = 'Skill was not updated.'
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
  <div class="form-skills">
    <h3 class="form-skills-title">
      {{ formAction }} a Skill
    </h3>
    <div class="form-skills-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="form-skills-alert-succes" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <form id="form-skills">
      <InputTitle
        errorMessage="Please enter a valid skill name"
        inputName="name"
        labeltext="Skill Name"
        placeholder="Enter a skill name..."
        :initialValue="updateSkillData.name || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputSkillType
        placeholder="The category of the skill (e.g. database, framework, library)"
        :initialValue="updateSkillData.type || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <TextareaGeneric
        errorMessage="Please enter a valid skill description"
        inputName="description"
        labeltext="Skill Description"
        placeholder="Briefly explain the skill and provide an example of how you used it..."
        :initialValue="updateSkillData.description || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputIcon
        :initialValue="updateSkillData.icon || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputOrder
        errorMessage="Please enter a valid sort priority"
        inputName="priority"
        labeltext="Sort Priority"
        placeholder="Enter number..."
        :initialValue="updateSkillData.priority || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <SelectBinary
        errorMessage="Please choose an option under Display Skill"
        inputName="show"
        labeltext="Display Skill"
        :initialValue="updateSkillData.show || ''"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <div class="right">
        <button @click.prevent="handleSubmit" class="button-primary" id="skill-submit">{{ formAction }} Skill</button>
        <button v-if="formAction === 'edit'" @click.prevent="cancelEditSkill" class="edit-button-cancel">cancel</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .edit-button-cancel {
    margin-left: 1rem;
  }
  .form-skills-title {
    text-transform: capitalize;
  }
</style>
