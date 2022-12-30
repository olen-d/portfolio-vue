<script setup>
  import { onMounted, ref } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  import FormUserProfile from '@/components/FormUserProfile.vue'

  const authStore = useAuthStore()
  const userId = authStore._id

  const accessToken = ref(authStore.currentJWT) // TODO: add authentication
  const editId = ref(userId)
  const formAction = ref('edit')
  const updateData = ref({})

  const readProfile = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/id/${userId}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${accessToken.value}`,
          'Content-Type': 'application/json'
        }
      })

      const result = await response.json()
      const { data: { email, firstName, lastName, username }, } = result
      updateData.value = {
        email,
        firstName,
        lastName,
        username,
      }
    } catch (error) {
      console.log(error)
    }
  }

  onMounted(() => {
    readProfile()
  })
</script>

<template>
  <div class="admin-profile">
    <h2>
      Profile
    </h2>
    <FormUserProfile
      :formAction="formAction"
      :editId="editId"
      :updateData="updateData"
    />
  </div>
</template>
