<script setup>
  import { onMounted, ref } from 'vue'

  import CardSummaryProject from '@/components/CardSummaryProject.vue'
  import LoadingIndicator from '@/components/LoadingIndicator.vue'

  const props = defineProps({
    limit: {
      type: Number,
      default: 1
    }
  })

  const error = ref(null)
  const loading = ref(false)
  const projects = ref([])
  const publicPath = ref(`${import.meta.env.VITE_ASSETS_HOST}`)

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects/featured/${props.limit}`)

      if (response.ok) {
          const result = await response.json()
          loading.value = false
          projects.value = result.data
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
  <div class="projects-featured">
    <CardSummaryProject
      v-for="{ _id, title, description, screenshot, deployedLink, repoLink } in projects"
      :key="_id"
    >
      <template #screenshot>
        <img
          class="screenshot"
          :src="`${publicPath}/assets/images/${screenshot}`"
          :alt="`Screenshot of ${title}`"
        />
      </template>
      <template #title>
        <h2 class="project-title">{{ title }}</h2>
      </template>
      <template #description>
        <p class="project-description">
          {{ description }}
        </p>
      </template>
      <template #link-deployed>
        <a :href="deployedLink"><i class="fas fa-link deployed"></i></a>
      </template>
      <template #link-repo>
        <a :href="repoLink"><i class="fab fa-github repo"></i></a>
      </template>
    </CardSummaryProject>
  </div>
</template>

<style scoped>
  .deployed, .repo {
    font-size: 2.5rem;
  }
  .repo {
    margin-left: 1.5rem;
  }
  .screenshot {
    width: 350px;
    height: auto;
  }
  .project-description {
    margin-right: 4rem;
    margin-bottom: 0rem;
    margin-left: 8rem;
  }
  .project-title {
    margin-top: 6rem;
    margin-left: 8rem;
  }
</style>