<script setup>
  import { computed, ref, watch } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  import AlertMessage from '@/components/AlertMessage.vue'
  import InputFileSingle from '@/components/formFields/InputFileSingle.vue'
  import InputOrder from '@/components/formFields/InputOrder.vue'
  import InputSlug from '@/components/formFields/InputSlug.vue'
  import InputTitle from '@/components/formFields/InputTitle.vue'
  import InputURI from '@/components/formFields/InputURI.vue'
  import SelectBinary from '@/components/formFields/SelectBinary.vue'
  import SkillsCheckboxes from '@/components/SkillsCheckboxes.vue'
  import TextareaGeneric from '@/components/formFields/TextareaGeneric.vue'

  const emits  = defineEmits(['cancelEditProject', 'projectCreated', 'projectUpdated'])

  const props = defineProps({
    formAction: {
      type: String
    },
    editProjectId: {
      type: String,
      default: null
    },
    method: { 
      type: Function 
    },
    updateProjectData: {
      type: Object,
      default: () => {
        return { skills: [] }
      }
    },
    wasSubmitted: {
      type: Boolean
    }
  })

  const authStore = useAuthStore()

  const accessToken = ref(authStore.currentJWT) // TODO: add authentication
  const checkedSkills = ref([])
  const errorDescription = ref('')
  const errorTitle = ref('')
  const formValues = ref([])
  const isError = ref(false)
  const isSuccess = ref(false)
  const shouldClearInputs = ref(false)
  const shouldClearCheckedSkills = ref(false)
  const successDescription = ref('')
  const successTitle = ref('')
  const totalFields = ref(0)
  const valueToSlug = ref('')

  const calculateChangedQuantity = () => {
    const changedQuantity = formValues.value.reduce((acc, element) => {
      return element.isChanged ? acc + 1 : acc
    }, 0)
    return changedQuantity
  }

  const cancelEditProject = () => {
    clearForm()
    emits('cancelEditProject')
  }

  const clearForm = () => {
    totalFields.value = formValues.value.length
    shouldClearCheckedSkills.value = true
    shouldClearInputs.value = true
  }

  const createProject = async formData => {
    try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects/create`, {
          method: 'post',
          headers: {
            'Authorization': `Bearer ${accessToken.value}`,
          },
          body: formData
        })
        const result = await response.json()
        const { status } = response

        if (status === 200) {
          clearForm()
          successDescription.value = 'The project was added successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true
          emits('projectCreated', result)
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

  const handleCheckedSkillsWereCleared = () => {
    checkedSkills.value = []
    shouldClearCheckedSkills.value = false
  }

  const handleSubmit = () => {
    const formErrors = getFormErrorsChanged()

    if (formErrors.length > 0) {
      updateFormErrors(formErrors)
      return
    } else {
      // Submit

      const formData = new FormData()
      formData.append('userId', authStore._id)

      const changedFormValues = formValues.value.reduce((acc, element) => {
        if (element.isChanged) {
          const { inputName, inputValue } = element
          acc.push({ inputName, inputValue })
        }
        return acc
      }, [])

      changedFormValues.forEach(element => {
        const { inputName, inputValue } = element
        formData.append(inputName, inputValue)
      })
      formData.append('skills', JSON.stringify(checkedSkills.value))

      if (props.formAction === 'add') {
        createProject(formData)
      } else if (props.formAction === 'edit') {
        updateProject(formData)
      } else {
        errorDescription.value = 'An invalid action was submitted and no data was sent to the server.'
        errorTitle.value = 'Internal Error'
        isError.value = true
      }
    }
  }

  const handleUpdateSkills = newSkills => {
    checkedSkills.value = newSkills
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

    if (name === 'title') { valueToSlug.value = event.inputValue }
  
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
      errorTitle.value = `The Project Form Has ${numberAgreement}`

      isError.value = true
    } else {
      isError.value = false
      errorDescription.value = ''
      errorTitle.value = ''
    }
  }

  const updateProject = async formData => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${props.editProjectId}`, {
        method: 'put',
        headers: {
          'Authorization': `Bearer ${accessToken.value}`,
        },
        body: formData
      })
      const result = await response.json()
      const { status } = response

      if (status === 200) {
        clearForm()
        successDescription.value = 'The project was updated successfully'
        successTitle.value = 'Great Success'
        isSuccess.value = true
        emits('projectUpdated', props.editProjectId)
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

  const isDisabledSubmit = computed(() => {
    const changedQuantity = calculateChangedQuantity()
    if (isError.value || (props.formAction === "add" && changedQuantity !== formValues.value.length) || props.formAction === 'edit' && changedQuantity < 1) {
      return true
    } else {
      return false
    }
  })

  watch(() => props.formAction, (newFormAction, prevFormAction) => {
    if (newFormAction === 'add') { clearForm() }
  })
</script>

<template>
  <div id="admin-projects-form">
    Title: {{ formValues[0]?.inputValue }}<br />
    Slug: {{ formValues[1]?.inputValue }}<br />
    <h4 class="admin-projects-form-title">
      {{ formAction }} a Project
    </h4>
    <div class="form-admin-projects-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="form-admin-projects-alert-succes" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <form id="admin-projects-form" enctype="multipart/form-data">
      <InputTitle
        errorMessage="Please enter a valid project title"
        labeltext="Project Title"
        placeholder="Enter a project title..."
        :initialValue="updateProjectData.title || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputSlug
        errorMessage="Please enter a valid project slug"
        labeltext="Project Slug"
        placeholder="Enter a project slug..."
        :initialValue="updateProjectData.slug || null"
        :shouldClearInput="shouldClearInputs"
        :valueToSlug="valueToSlug"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <TextareaGeneric
        errorMessage="Please enter a valid project description"
        inputName="description"
        labeltext="Project Description"
        placeholder="Briefly explain the project and what problems it solves..."
        :initialValue="updateProjectData.description || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputFileSingle 
        inputName="file"
        labeltext="Screenshot"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputURI
        errorMessage="Please enter a valid URI for the deployed link"
        inputName="deployedLink"
        labeltext="Deployed Link"
        placeholder="Enter a link to the deployed project..."
        :initialValue="updateProjectData.deployedLink || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputURI
        errorMessage="Please enter a valid URI for the repository link"
        inputName="repoLink"
        labeltext="Repository Link"
        placeholder="Enter a link to the repository where the project source code is hosted..."
        :initialValue="updateProjectData.repoLink || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <SkillsCheckboxes
        :initialCheckedSkills="updateProjectData.skills"
        :shouldClearCheckedSkills="shouldClearCheckedSkills"
        @checked-skills-were-cleared="handleCheckedSkillsWereCleared"
        @update-skills="handleUpdateSkills"
      >
      </SkillsCheckboxes>
      <InputOrder
        errorMessage="Please enter a valid sort priority"
        inputName="priority"
        labeltext="Sort Priority"
        placeholder="Enter number..."
        :initialValue="updateProjectData.priority || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <SelectBinary
        errorMessage="Please choose an option under Featured Project"
        inputName="isFeatured"
        labeltext="Featured Project?"
        :initialValue="updateProjectData.isFeatured || ''"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <InputOrder
        errorMessage="Please enter a valid featured project priority"
        inputName="featuredPriority"
        labeltext="Featured Project Sort Priority"
        placeholder="Enter number..."
        :initialValue="updateProjectData.featuredPriority || null"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <SelectBinary
        errorMessage="Please choose an option under Display Project"
        inputName="show"
        labeltext="Display Project?"
        :initialValue="updateProjectData.show || ''"
        :shouldClearInput="shouldClearInputs"
        @change-form-values="updateFormValues($event)" 
        @remove-form-values="removeFormValues($event)"
      />
      <div class="right">
        <button
          @click.prevent="handleSubmit"
          class="button-primary"
          :disabled="isDisabledSubmit"
          id="project-submit"
        >
          {{ formAction }} Project
        </button>
        <button
          v-if="formAction === 'edit'"
          @click.prevent="cancelEditProject"
          class="edit-button-cancel"
        >
          cancel
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
  .admin-projects-form-title {
    text-transform: capitalize;
  }
  .edit-button-cancel {
      margin-left: 1rem;
    }
</style>
