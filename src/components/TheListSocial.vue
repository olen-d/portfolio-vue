<script setup>
  import { onMounted, ref, watch } from 'vue'

  import AlertMessage from '@/components/AlertMessage.vue'
  import ModalConfirmCancel from '@/components/ModalConfirmCancel.vue'

  const emits = defineEmits(['updateFormAction', 'updateItemData', 'updateItemId'])
  const props = defineProps({
    newLinkData: {
      type: Object,
    },
    updatedLinkData: {
      type: Object
    }
  })

  const errorDescription = ref('')
  const errorTitle = ref('')
  const isLoading = ref(true)
  const isError = ref(false)
  const isSuccess = ref(false)
  const modalAction = ref('')
  const modalCancel = ref('')
  const modalConfirm = ref('')
  const modalItemId = ref('')
  const modalMessage = ref('')
  const modalTitle = ref('')
  const payload = ref({}) // TODO: delete this when Action and ItemId props are fixed when ModalConfirmCancel is re-written
  const showModalConfirmCancel = ref(false)
  const socials = ref([])
  const successDescription = ref('')
  const successTitle = ref('')

  onMounted(() => {
    const username = 'olen.d' // TODO: pass this in as a prop
    readSocials(username)
  })

  const addSocial = () => {
    socials.value.push(props.newLinkData)
    socials.value.sort((a, b) => a.order - b.order)
  }

  const cancelAction = () => {
    showModalConfirmCancel.value = false
  }

  const confirmAction = v => {
    switch (v.action) {
      case "delete":
        deleteSocial(v.data)
        break
    }
    showModalConfirmCancel.value = false
  }

  const confirmDeleteItem = e => {
      const itemId = e.currentTarget.getAttribute('data-id')
      const itemName = e.currentTarget.getAttribute('data-name')

      modalAction.value = 'delete'
      modalCancel.value = 'cancel'
      modalConfirm.value = 'delete'
      modalItemId.value = itemId
      modalMessage.value = `Do you really want to delete the social medial link: ${itemName}?`
      modalTitle.value = 'Delete Social Media Link'

      payload.value = { action: 'delete', data: itemId } // TODO: delete this when Action and ItemId props are fixed when ModalConfirmCancel is re-written

      showModalConfirmCancel.value = true
    }

  const deleteSocialsTableRow = id => {
    const index = findSocialIndexById(id)
    if (index > -1) {
      socials.value.splice(index, 1)
    }
  }

  const deleteSocial = async id => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/social/link/${id}`, {
        method: "DELETE"
      })

      const result = await response.json()
      const {result: { ok, deletedCount }, } = result;

      if (ok === 1 && deletedCount === 1) {
        successDescription.value = 'Social media link deleted successfully.'
        successTitle.value = 'Great Success'
        isSuccess.value = true
        deleteSocialsTableRow(id);
      } else {
        errorDescription.value = 'Social media link was not deleted. Database error.'
        errorTitle.value = 'Server Error'
        isError.value = true
      }
    } catch (error) {
      errorDescription.value = 'Social media link was not deleted. Server error.'
      errorTitle.value = 'Server Error'
      isError.value = true
    }
  }

  const editItem = event => {
    const id = event.currentTarget.getAttribute("data-id");

    const itemIndex = findSocialIndexById(id)
    const data = { ...socials.value[itemIndex] }

    emits('updateFormAction', 'edit')
    emits('updateItemData', data)
    emits('updateItemId', id)
  }

  const findSocialIndexById = id => {
    const index = socials.value.map(item => item._id).indexOf(id)
    return index
  }

  const readSocials = async username => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/social/user/${username}`)
      const data = await response.json()

      socials.value = data.social
      isLoading.value = false
    } catch (error) {
      console.log(`TheListSocial ERROR:\n${error}`)
    }
  }

  const updateSocial = () => {
    if (props.updatedLinkData.ok === 1) {
      const itemIndex = findSocialIndexById(props.updatedLinkData.id)

      const [target] =  socials.value.slice(itemIndex, itemIndex + 1)
      const source = { ...props.updatedLinkData.data }
      const returnedTarget = Object.assign(target, source)

      socials.value.splice(itemIndex, 1, returnedTarget) // Mutates socials
      socials.value.sort((a, b) => a.order - b.order)
    }
  }

  watch(() => props.newLinkData, (newLinkData, prevNewLinkData) => {
    if (newLinkData !== prevNewLinkData) {
      addSocial()
    }
  })

  watch(() => props.updatedLinkData, (newUpdatedLinkData, prevUpdatedLinkData) => {
    if (newUpdatedLinkData !== prevUpdatedLinkData) {
      updateSocial()
    }
  })
</script>

<template>
  <div class="the-list-social">
    <ModalConfirmCancel
      v-if="showModalConfirmCancel"
      :payload = "payload"
      :action = "modalAction"
      :cancel = "modalCancel"
      :confirm = "modalConfirm"
      :message = "modalMessage" 
      :title = "modalTitle"

      @confirm-action="confirmAction"
      @cancel-action="cancelAction"
    />
    <div class="the-list-social-alert-error" v-if="isError">
      <AlertMessage :title="errorTitle" type="error">
        {{ errorDescription }}
      </AlertMessage>
    </div>
    <div class="the-list-social-profile-alert-succes" v-if="isSuccess">
      <AlertMessage :title="successTitle" type="success">
        {{ successDescription }}
      </AlertMessage>
    </div>
    <div class="none-found" v-if="!isLoading && socials.length < 1">
      <p>No social media links were found.</p>
    </div>
    <table v-if="socials.length > 0">
      <thead>
        <tr>
          <th scope="col">Icon</th>
          <th scope="col">Anchor</th>
          <th scope="col">URI</th>
          <th scope="col">Sort Priority</th>
        </tr>
      </thead>
      <tbody id="socials" v-if="!isLoading">
        <tr v-for="{ _id, anchor, uri, icon, order } in socials" :key="_id" :id="_id">
          <td><i :class="icon" class="table-icon"></i></td>
          <td>{{ anchor }}</td>
          <td>{{ uri }}</td>
          <td>{{ order }}</td>
          <td><i @click="editItem" class="fas fa-edit edit" :data-id="_id"></i></td>
          <td><i @click="confirmDeleteItem" class="fas fa-times delete" :data-id="_id" :data-name="anchor"></i></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
