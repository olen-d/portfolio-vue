<script setup>
  import { onMounted, ref } from 'vue'

  import LoadingIndicator from '@/components/LoadingIndicator.vue'

  const props = defineProps({
    username: {
      type: String
    }
  })

  const error = ref('')
  const loading = ref(false)
  const profile = ref({})

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/profiles/${props.username}`)

      if (response.ok) {
        const data = await response.json()
        loading.value = false
        profile.value = data.profile
      } else {
        throw new Error('Network response was not ok. Unable to fetch. ')
        }
    } catch (err) {
      error.value = err.toString()
      loading.value = false
    }
  })
</script>

<template>
  <div class="user-profile">
    <LoadingIndicator :loading="loading" :error="error" />
    <div v-if="profile" class="profile">
      <h4 class="title">
        {{ profile.title }}
      </h4>
      <span v-html="profile.bio"></span>
    </div>
  </div>
</template>

<style scoped>
  .user-profile {
    margin: 0rem;
    padding: 0rem;
  }

  .profile { 
    margin-bottom: 0rem;
    padding-bottom: 0rem;
  }
</style>
