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
  const user = ref({})

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/users/${props.username}`)

      if (response.ok) {
        const data = await response.json()
        loading.value = false
        user.value = data.user
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
  <div class="user-full-name">
    <div v-if="loading || error" class="loading-indicator-wrapper">
      <LoadingIndicator :loading="loading" :error="error" />
    </div>
    <div v-if="user" class="user-information">
      <h1>{{ user.firstName }}&nbsp;{{ user.lastName }}</h1>
    </div>
  </div>
</template>

<style scoped>
  .user-full-name,
  .user-information {
    margin: 0rem;
    padding: 0rem;
  }

  .loading-indicator-wrapper {
    margin-top: 6rem;
    margin-bottom: 2rem;
  }
</style>
