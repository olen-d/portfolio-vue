<script setup>
  // import { mapGetters } from "vuex";
  import { onMounted, ref } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  import AdminSkillsForm from '@/components/AdminSkillsForm.vue'
  import AlertMessage from '@/components/AlertMessage.vue'
  import ModalConfirmCancel from '@/components/ModalConfirmCancel.vue'

  const authStore = useAuthStore()

  const accessToken = ref(authStore.currentJWT)
  const editSkillId = ref(null)
  const errorDescription = ref('')
  const errorTitle = ref('')
  const formAction = ref('add')
  const isError = ref(false)
  const isSuccess = ref(false)
  const modalConfirmCancelProps = ref({
    payload: {
      action: null,
      data: null
    },
    title: null,
    message: null,
    confirm: 'ok',
    cancel: 'cancel'
  })
  const showModalConfirmCancel = ref(false)
  const skills = ref([])
  const successDescription = ref('')
  const successTitle = ref('')
  const updateSkillData = ref({})

  const cancelAction = () => {
    showModalConfirmCancel.value = false
  }

  const cancelEditSkill = () => {
    formAction.value = 'add'
  }

  const confirmAction = event => {
    const { action, data } = event
    switch (action) {
      case 'delete':
        deleteSkill(data)
        break
    }
    showModalConfirmCancel.value = false
  }

  const confirmDeleteSkill = event => {
    const skillId = event.currentTarget.getAttribute('data-id')
    const skillName = event.currentTarget.getAttribute('data-name')

    modalConfirmCancelProps.value.payload.action = 'delete'
    modalConfirmCancelProps.value.payload.data = skillId
    modalConfirmCancelProps.value.title = 'Delete Skill'
    modalConfirmCancelProps.value.message =  `Do you really want to delete the skill: ${skillName}?`
    modalConfirmCancelProps.value.confirm = 'delete'

    showModalConfirmCancel.value = true
  }

  const createSkillsTableRow =  event => {
    skills.value.push(event)
  }

  const deleteSkill =  async skillId => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/delete`, {
        method: "delete",
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ skillId })
      })
      const { status } = response

      if (status === 200) {
        const data = await response.json()
        const { ok, deletedCount } = data

        if (ok === 1 && deletedCount === 1) {
          successDescription.value = 'The skill was deleted successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true

          deleteSkillsTableRow(skillId)
        } else {
          errorDescription.value = 'The skill was not deleted. Please try again in a few minutes.'
          errorTitle.value = 'Server Error'
          isError.value = true
        }
      }
    } catch (error) {
      console.log(`Admin Pages Skills Delete Error:\n${error}`)
    }
  }

  const deleteSkillsTableRow = skillId => {
    const index = findSkillIndexById(skillId)
    if (index > -1) {
      skills.value.splice(index, 1);
    }
  }

  const findSkillIndexById = skillId => {
    const index = skills.value.map(item => item._id).indexOf(skillId)
    return index
  }

  const handleShowFormSkills =  action => {
    formAction.value = action
  }

  const readSkills = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills`)
      const { status } = response
      const result = await response.json()

      if (status === 200) {
        skills.value = result.skills
      }
    } catch (error) {
      console.log(`Admin Pages Skills Read Error:\n${error}`)
    }
  }

  const skillCreated = event => {
    if (event._id) {
      createSkillsTableRow(event)
      // TODO: Update status bar with success result
    } else {
      // TODO: Update status bar with fail result
    }
  }

  const skillUpdated = skillId => {
    updateSkillsTableRow(skillId)
    // Update status bar with result
  }

  const updateSkill = event => {
    const skillId = event.currentTarget.getAttribute('data-id')
    const skillIndex = findSkillIndexById(skillId)
    const skill = { ...skills.value[skillIndex] } // Clone the current skill object

    delete skill._id
    delete skill.userId

    updateSkillData.value = skill
    formAction.value = 'edit'
    editSkillId.value = skillId
  }

  const updateSkillsTableRow = async skillId => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/id/${skillId}`)
      const { status } = response
      const result = await response.json()

      if (status === 200) {
        const { skill } = result
        const index = findSkillIndexById(skillId)

        skills.value.splice(index, 1, skill);

        formAction.value = 'add'
        editSkillId.value = null
        updateSkillData.value = {}
      }
    } catch (error) {
      console.log(`Admin Pages Skills Update Error:\n${error}`)
    }
  }

  onMounted(() => {
    readSkills()
  })
</script>

<template>
  <div class="admin-pages-skills">
    <ModalConfirmCancel
      v-if="showModalConfirmCancel"
      :payload = modalConfirmCancelProps.payload
      :action = modalConfirmCancelProps.action
      :title = modalConfirmCancelProps.title
      :message = modalConfirmCancelProps.message 
      :confirm = modalConfirmCancelProps.confirm
      :cancel = modalConfirmCancelProps.cancel
      @confirm-action="confirmAction"
      @cancel-action="cancelAction"
    >
    </ModalConfirmCancel>
    <h3>
      Skills
    </h3>
    <button @click="handleShowFormSkills('add')">
      Add Skill
    </button>
    <div class="form-admin-pages-skills-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="form-admin-pages-skills-alert-succes" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <table>
      <thead>
        <tr>
          <th scope="col">Icon</th>
          <th scope="col">Skill</th>
          <th scope="col">Type</th>
          <th scope="col">Description</th>
          <th scope="col">Sort Priority</th>
          <th scope="col">Display</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody id="skills">
        <tr v-for="{ _id, type, name, description, show, icon, priority } in skills" :key="_id" :id="_id">
          <td><i :class="icon" class="table-icon"></i></td>
          <td>{{ name }}</td>
          <td>{{ type }}</td>
          <td>{{ description }}</td>
          <td>{{ priority }}</td>
          <td>{{ show }}</td>
          <td><i @click="updateSkill" class="fas fa-edit edit" :data-id="_id"></i></td>
          <td><i @click="confirmDeleteSkill" class="fas fa-times delete" :data-id="_id" :data-name="name"></i></td>
        </tr>
      </tbody>
    </table>
    <AdminSkillsForm
      :formAction="formAction"
      :editSkillId="editSkillId"
      :updateSkillData="updateSkillData"
      @skill-created="skillCreated"
      @skill-updated="skillUpdated"
      @cancel-edit-skill="cancelEditSkill"
    >
    </AdminSkillsForm>
  </div>
</template>

<style scoped>
  textarea {
    height: 16rem;
  }
</style>
