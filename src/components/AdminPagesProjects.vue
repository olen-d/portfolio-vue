<script setup>
  import { computed, onMounted, ref } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  import AdminProjectsCard from '@/components/AdminProjectsCard.vue'
  import AdminProjectsForm from '@/components/AdminProjectsForm.vue'
  import AlertMessage from '@/components/AlertMessage.vue'
  import ModalConfirmCancel from '@/components/ModalConfirmCancel.vue'
  import SelectGeneric from '@/components/view-modifiers/SelectGeneric.vue'

  const authStore = useAuthStore()

  const accessToken = ref(authStore.currentJWT)
  const editProjectId = ref('')
  const errorDescription = ref('')
  const errorTitle = ref('')
  const filterSkill = ref('')
  const formAction = ref('add')
  const isError = ref(false)
  const isSuccess = ref(false)
  const modalConfirmCancelProps = ref({
    payload: {
      action: '',
      data: ''
    },
    title: '',
    message: '',
    confirm: 'ok',
    cancel: 'cancel'
  })
  const options = ref([])
  const projects = ref([])
  const publicPath = ref(import.meta.env.BASE_URL)
  const showFormProjects = ref(false)
  const showModalConfirmCancel = ref(false)
  const successDescription = ref('')
  const successTitle = ref('')
  const updateProjectData = ref({ skills: [] })

  // Computed
  const displayProjects = computed(() => {
    const displayProjects = projects.value.filter(
      project => project.show === 'Yes' || project.show === 'No'
    )
    return displayProjects
  })

  const filteredBySkillProjects = computed(() => {
    const filteredBySkillProjects = displayProjects.value.filter(project => {
        return project.skills.indexOf(filterSkill.value) !== -1
      })
    return filteredBySkillProjects.length > 0 ? filteredBySkillProjects : displayProjects.value
  })

  const sortedProjects = computed(() => {
    const sortedProjects = [...filteredBySkillProjects.value].sort((a, b) => {
      return a.priority - b.priority
    })
    return sortedProjects
  })

  // Functions
  const cancelAction = () => {
    showModalConfirmCancel.value = false
  }

  const cancelEditProject = () => {
    formAction.value = 'add'
  }

  const confirmAction = event => {
    const { action, data } = event
    switch (action) {
      case 'delete':
        deleteProject(data)
        break
    }
    showModalConfirmCancel.value = false
  }

  const confirmDeleteProject = event => {
    const projectId = event.currentTarget.getAttribute('data-id')
    const projectName = event.currentTarget.getAttribute('data-title')

    // TODO: Fix this mess, just call the modal with props
    modalConfirmCancelProps.value.payload.action = 'delete'
    modalConfirmCancelProps.value.payload.data = projectId
    modalConfirmCancelProps.value.title = 'Delete Project'
    modalConfirmCancelProps.value.message = `Do you really want to delete the project: ${projectName}?`
    modalConfirmCancelProps.value.confirm = 'delete'

    showModalConfirmCancel.value = true
  }

  const createProjectsAddCard = event => {
    projects.value.push(event)
  }

  const deleteProject = async projectId => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects/delete`, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ projectId })
      })
      const { status } = response

      if (status === 200) {
        const data = await response.json()
        const { ok, deletedCount } = data

        if (ok === 1 && deletedCount === 1) {
          successDescription.value = 'The project was deleted successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true

          deleteProjectsRemoveCard(projectId)
        } else {
          errorDescription.value = 'The project was not deleted. Please try again in a few minutes.'
          errorTitle.value = 'Server Error'
          isError.value = true
        }
      }
      // TODO: Check for and handle errors
    } catch (error) {
      // TODO: Finish this error
      console.log('ERROR:\nAdmin Pages Projects Delete Project\n' + error)
    }
  }

  const deleteProjectsRemoveCard = projectId => {
    const index = findProjectIndexById(projectId)
    if (index > -1) {
      projects.value.splice(index, 1)
    }
  }

  const editProject = event => {
    showFormProjects.value = true

    const projectId = event.currentTarget.getAttribute('data-id')
    const projectIndex = findProjectIndexById(projectId)
    const project = { ...projects.value[projectIndex] } // Clone the current project object

    project.file = ''
    delete project._id

    updateProjectData.value = project

    formAction.value = 'edit'
    editProjectId.value = projectId
  }

  const findProjectIndexById = projectId => {
    return projects.value.map(item => item._id).indexOf(projectId)
  }

  const formatUrl = url => {
    const urlPieces = url.split('://')
    return urlPieces[1]
  }

  const handleShowFormProject = action => {
    formAction.value = action
    showFormProjects.value = true
  }

  const optionSelected = event => {
    const { selectedOption } = event
    filterSkill.value = selectedOption.value
  }

  const projectCreated = event => {
    if (event._id) {
      createProjectsAddCard(event)
    } else {
      // TODO: Update status bar with fail result
    }
  }

  const projectUpdated = projectId => {
    updateProjectCard(projectId)
    // TODO: Consider scrolling to the project and highlighting the background for 2 seconds
  }

  const readProjectById = async projectId => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects/id/${projectId}`)
      const { status } = response

      if (status === 200) {
        const data = await response.json()
        return data
      }
      // TODO: Finish the error handling to address all cases
      if (status === 404) {
        errorDescription.value = `A project with the id: ${projectId} was not found`
        errorTitle.value = 'Project Not Found'
        isError.value = true
        return null
      }
    } catch (error) {
      // TODO: Finish this error
      console.log('ERROR:\nAdmin Pages Projects Read Projects\n' + error)
    }
  }

  const readProjects = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`)
      const { status } = response
      if (status === 200) {
        const data = await response.json()
        projects.value = data.projects
      }
      // TODO: Finish the error handling to address all cases
      if (status === 404) {
        errorDescription.value = 'No projects were found. Please add a project and try again.'
        errorTitle.value = 'No Projects Found'
        isError.value = true
      }
    } catch (error) {
      // TODO: Finish this error
      console.log('ERROR:\nAdmin Pages Projects Read Projects\n' + error)
    }
  }

  const readSkills = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/sort/type+name`)
      const { status } = response

      if (status === 200) {
        const data = await response.json()
        options.value = data.skills.map(({ _id, name: option }) => { return { _id, option } })
      }
      // TODO: Finish the error handling to address all cases
      if (status === 404 && result.message) {
        errorDescription.value = 'No projects were found. Please add a project and try again.'
        errorTitle.value = 'No Projects Fuond'
        isError.value = true
      }
    } catch (error) {
      // TODO: Finish this error
      console.log('ERROR:\nAdmin Pages Projects Read Skills\n' + error)
    }
  }

  const updateProjectCard = async projectId => {
    const { project: data } = await readProjectById(projectId)
    const index = findProjectIndexById(projectId)

    projects.value.splice(index, 1, data)
    updateProjectData.value = { skills: [] }

    // TODO: Consider handling the following elsewhere
    formAction.value = 'add'
  }

  onMounted(() => {
    readProjects()
    readSkills()
  })
</script>

<template>
  <div id="admin-pages-projects">
    <ModalConfirmCancel
      v-if="showModalConfirmCancel"
      :payload="modalConfirmCancelProps.payload"
      :action="modalConfirmCancelProps.action"
      :title="modalConfirmCancelProps.title"
      :message="modalConfirmCancelProps.message"
      :confirm="modalConfirmCancelProps.confirm"
      :cancel="modalConfirmCancelProps.cancel"
      @confirm-action="confirmAction"
      @cancel-action="cancelAction"
    />
    <button @click="handleShowFormProject('add')">
      Add Project
    </button>
    <div class="form-admin-pages-projects-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="form-admin-pages-projects-alert-succes" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <AdminProjectsForm
      v-if="showFormProjects"
      :formAction="formAction"
      :editProjectId="editProjectId"
      :updateProjectData="updateProjectData"
      @project-created="projectCreated"
      @project-updated="projectUpdated"
      @cancel-edit-project="cancelEditProject"
    />
    <router-view></router-view>
    <h4>
      Filter
    </h4>
    <SelectGeneric :options="options" @option-selected="optionSelected($event)" />
    <div
      v-for="{
        _id,
        deployedLink,
        description,
        overview,
        challenge,
        approach,
        title,
        slug,
        repoLink,
        screenshot,
        skills,
        priority,
        isFeatured,
        featuredPriority,
        show
      } in sortedProjects"
      :key="_id"
      :id="_id"
      class="card-container"
    >
      <div class="card-actions">
        <i @click="editProject" class="fas fa-edit edit" :data-id="_id"></i>
        <i
          @click="confirmDeleteProject"
          class="fas fa-times delete"
          :data-id="_id"
          :data-title="title"
        ></i>
      </div>
      <AdminProjectsCard
        v-bind="{
          _id,
          deployedLink,
          description,
          overview,
          challenge,
          approach,
          title,
          slug,
          repoLink,
          screenshot,
          skills,
          priority,
          isFeatured,
          featuredPriority,
          show
        }"
      />
    </div>
  </div>
</template>

<style scoped>
  .card-actions {
    margin-top: 3rem;
    margin-bottom: 3rem;
  }

  .card-container {
    margin-top: 6rem;
    padding: 0rem;
    /* background-color:#aaa; */
  }

  .url {
    word-break: break-word;
    /* overflow: hidden; */
  }
</style>
