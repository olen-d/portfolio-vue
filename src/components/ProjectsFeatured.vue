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
      v-for="{ _id, title, slug, description, screenshot, deployedLink, repoLink } in projects"
      :key="_id"
    >
      <template #screenshot>
        <div class="screenshot">
          <img
            class="screenshot-image"
            :src="`${publicPath}/assets/images/${screenshot}`"
            :alt="`Screenshot of ${title}`"
          />
        </div>
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
      <template #call-to-action>
        <router-link :to="`/projects/${slug}`"><button class="button-primary">Learn More</button></router-link>
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
  .screenshot-image {
    width: 100%;
    object-fit: contain;
  }
  .project-description {
    padding-right: 3rem;
    padding-bottom: 0rem;
    padding-left: 3rem;
  }
  .project-description p {
    margin: 0rem;
    padding: 0rem;
  }
  .project-title {
    margin-top: 6rem;
  }
  @media (min-width: 1024px) {
    .project-description {
      padding-right: 3rem;
      padding-bottom: 0rem;
      padding-left: 0rem;
    }
  }
</style>