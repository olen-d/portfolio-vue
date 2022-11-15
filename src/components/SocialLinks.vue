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
  const socials = ref({})

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/social/user/${props.username}`)

      if (response.ok) {
        const data = await response.json()
        loading.value = false
        socials.value = data.social
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
  <div class="social-links">
    <div v-if="loading || error" class="loading-indicator-wrapper">
      <LoadingIndicator :loading="loading" :error="error" />
    </div>
    <div v-if="socials" class="socials">
      <span
        v-for="{ _id, anchor, uri, icon } in socials"
        :key="_id"
        class="social-items"
      >
        <a :href="uri" :title="`Olen Daelhousen on ${anchor}`">
          <i :class="icon"></i>
        </a>&nbsp;
      </span>
    </div>
  </div>
</template>

<style scoped>
.loading-indicator-wrapper {
  width: 60%;
  margin: 2.225rem auto 2.225rem auto;
}

.social-links {
  padding-top: 1rem;
  padding-bottom: 1rem;
  background-color: #136a9b;
  color: #fcc914;
  text-align: center;
}

.social-items {
  font-size: 4rem;
}

.social-links a:link {
  color: #ffffff;
}

.social-links a:visited {
  color: #ffffff;
}

.social-links a:hover {
  color: #fcc914;
}
</style>
