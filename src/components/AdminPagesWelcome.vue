<script setup>
  import { computed, onMounted, ref } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  import AlertMessage from '@/components/AlertMessage.vue'
  import FormWelcomeItem from '@/components/FormWelcomeItem.vue'
  import ModalConfirmCancel from '@/components/ModalConfirmCancel.vue'

  const authStore = useAuthStore()

  const accessToken = ref(authStore.currentJWT) // TODO: add authentication
  const editId = ref(null)
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
  const showFormWelcomeItem = ref(false)
  const successDescription = ref('')
  const successTitle = ref('')
  const updateData = ref({})
  const welcomeItems = ref([])

  const cancelAction = () => {
    showModalConfirmCancel.value = false
  }

  const cancelEditWelcomeItem = () => {
    formAction.value = 'add'
  }

  const confirmAction = event => {
    const { action, data } = event
    switch (action) {
      case 'delete':
        deleteWelcomeItem(data)
        break
    }
    showModalConfirmCancel.value = false
  }

  const confirmDeleteWelcomeItem = event => {
    const welcomeItemId = event.currentTarget.getAttribute('data-id')
    const welcomeItemName = event.currentTarget.getAttribute('data-name')

    modalConfirmCancelProps.value.payload.action = 'delete'
    modalConfirmCancelProps.value.payload.data = welcomeItemId
    modalConfirmCancelProps.value.title = 'Delete Welcome Item'
    modalConfirmCancelProps.value.message = `Do you really want to delete the welcome item: ${welcomeItemName}?`
    modalConfirmCancelProps.value.confirm = 'delete'

    showModalConfirmCancel.value = true
  }

  const createWelcomeItemsTableRow =  event => {
    welcomeItems.value.push(event)
  }

  const deleteWelcomeItem =  async id => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/welcome`, {
        method: 'delete',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id })
      })
      const { status } = response

      if (status === 200) {
        const data = await response.json()
        const { ok, deletedCount } = data

        if (ok === 1 && deletedCount === 1) {
          successDescription.value = 'The welcome item was deleted successfully'
          successTitle.value = 'Great Success'
          isSuccess.value = true

          deleteWelcomeItemsTableRow(id)
        } else {
          errorDescription.value = 'The welcome item was not deleted. Please try again in a few minutes.'
          errorTitle.value = 'Server Error'
          isError.value = true
        }
      }
    } catch (error) {
      console.log(`Admin Pages Welcome Delete Error:\n${error}`)
    }
  }

  const deleteWelcomeItemsTableRow = id => {
    const index = findWelcomeItemIndexById(id)
    if (index > -1) {
      welcomeItems.value.splice(index, 1);
    }
  }

  const findWelcomeItemIndexById = id => {
    const index = welcomeItems.value.map(item => item._id).indexOf(id)
    return index
  }

  const handleShowFormWelcomeItem = action => {
    formAction.value = action
    showFormWelcomeItem.value = true
  }

  const readWelcomeItems = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/welcome/all`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        }
      })
      const { status } = response
      const result = await response.json()

      if (status === 200) {
        const { data } = result
        welcomeItems.value = data
      } else {
        //
      }
    } catch (error) {
      console.log(`Admin Pages Welcome Error\n${error}`)
    }
  }

  const updateWelcomeItem = event => {
    const id = event.currentTarget.getAttribute('data-id')
    const index = findWelcomeItemIndexById(id)
    const welcomeItem = { ...welcomeItems.value[index] } // Clone the current welcome item object

    delete welcomeItem._id
    delete welcomeItem.userId

    updateData.value = welcomeItem
    formAction.value = 'edit'
    editId.value = id

    showFormWelcomeItem.value = true
  }

  const updateWelcomeItemsTableRow = async id => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/welcome/id/${id}`)
      const { status } = response

      const result = await response.json()

      if (status === 200) {
        const { data: [welcomeItem] } = result
        const index = findWelcomeItemIndexById(id)

        welcomeItems.value.splice(index, 1, welcomeItem)

        formAction.value = 'add'
        editId.value = null
        updateData.value = {}
      }
    } catch (error) {
      console.log(`Admin Pages Welcome Update Error:\n${error}`)
    }
  }

  const welcomeItemCreated = event => {
    if (event._id) {
      createWelcomeItemsTableRow(event)
      // TODO: Update status bar with success result
    } else {
      // TODO: Update status bar with fail result
    }
  }

  const welcomeItemUpdated = id => {
    updateWelcomeItemsTableRow(id)
    // Update status bar with result
  }

  // Computed
  const sortedWelcomeItems = computed(() => {
    const sortedWelcomeItems = [...welcomeItems.value].sort((a, b) => {
      return a.priority - b.priority
    })
    return sortedWelcomeItems
  })

  onMounted(() => {
    readWelcomeItems()
  })
</script>

<template>
  <div class="admin-pages-welcome">
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
      Welcome
    </h3>
    <button @click="handleShowFormWelcomeItem('add')">
      Add Welcome Item
    </button>
    <div class="admin-pages-welcome-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="admin-pages-welcome-alert-succes" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <FormWelcomeItem
      v-if="showFormWelcomeItem"
      :formAction="formAction"
      :editId="editId"
      :updateData="updateData"
      @welcome-item-created="welcomeItemCreated"
      @welcome-item-updated="welcomeItemUpdated"
      @cancel-edit-welcome-item="cancelEditWelcomeItem"
    />
    <table>
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Content</th>
          <th scope="col">Sort Priority</th>
          <th scope="col">Display</th>
          <th scope="col"></th>
          <th scope="col"></th>
        </tr>
      </thead>
      <tbody id="welcome-items">
        <tr v-for="{ _id, title, content, show, priority } in sortedWelcomeItems" :key="_id" :id="_id">
          <td>{{ title }}</td>
          <td>{{ content }}</td>
          <td>{{ priority }}</td>
          <td>{{ show }}</td>
          <td><i @click="updateWelcomeItem" class="fas fa-edit edit" :data-id="_id"></i></td>
          <td><i @click="confirmDeleteWelcomeItem" class="fas fa-times delete" :data-id="_id" :data-name="title"></i></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
  textarea {
    height: 16rem;
  }
</style>
