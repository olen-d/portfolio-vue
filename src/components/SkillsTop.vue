<script setup>
  import { onMounted, ref } from 'vue'

  import LoadingIndicator from '@/components/LoadingIndicator.vue'

  const props = defineProps({
    limit: {
      type: Number,
      default: 3
    }
  })

  const error = ref('')
  const loading = ref(false)
  const skills = ref([])

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/top/${props.limit}`)

      if (response.ok) {
          const data = await response.json()
          loading.value = false
          skills.value = data.skills
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
  <div class="skills-top">
    <div v-if="loading || error" class="loading-indicator-wrapper">
      <LoadingIndicator :loading="loading" :error="error" />
    </div>
    <div v-if="skills" class="skills">
      <div
        v-for="{ _id, name, description, icon } in skills"
        :key="_id"
        class="card-skinny"
      >
        <div class="card-title">
          <i :class="icon" class="card-icon"></i>
          <h2>
            {{ name }}
          </h2>
          <p>
            {{ description }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .skills-top {
    margin: 0rem;
    padding: 0rem;
  }

  .loading-indicator-wrapper {
    margin-bottom: 10rem;
  }

  .skills {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    justify-items: center;
    column-gap: 1rem;
  }

  @media (min-width: 780px) {
    .skills {
      justify-items: start;
    }
  }
</style>
