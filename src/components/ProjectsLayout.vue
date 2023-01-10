<script setup>
  import { computed, onMounted, ref } from 'vue'

  import CardBriefProject from '@/components/CardBriefProject.vue'
  import HeaderFrontEnd from '@/components/HeaderFrontEnd.vue'
  import LoadingIndicator from '@/components/LoadingIndicator.vue'

  const error = ref('')
  const loading = ref(false)
  const projects = ref([])
  const publicPath = ref(`${import.meta.env.VITE_ASSETS_HOST}`)

  // Computed
  const displayProjects = computed(() => {
    return projects.value.filter(project => project.show === "Yes")
  })

  const sortedProjects = computed(() => {
    return [...displayProjects.value].sort((a, b) => {
      return a.priority - b.priority
    })
  })

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects`)
      if (response.ok) {
        const data = await response.json()
        loading.value = false
        projects.value = data.projects
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
  <div class="projects-layout">
    <HeaderFrontEnd />
    <div class="container">
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <h1>Projects</h1>
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <div class="loading-indicator-wrapper">
            <LoadingIndicator :loading="loading" :error="error" />
          </div>
          <div v-if="!loading" class="projects">
            <CardBriefProject
              v-for="{ _id, title, slug, deployedLink, description, repoLink, screenshot } in sortedProjects"
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
                <h2 class="project-title">
                  {{ title }}
                </h2>
              </template>
              <template #description>
                <p class="project-description">
                  {{ description }}
                </p>
              </template>
              <template #link-deployed>
                <a :href="deployedLink" :title="`Open ${title}`"><i class="fas fa-link deployed"></i></a>
              </template>
              <template #link-repo>
                <a :href="repoLink" :title="`${title} Source Code`"><i class="fab fa-github repo"></i></a>
              </template>
              <template #call-to-action>
                <div class="call-to-action">
                  <router-link :to="`/projects/${slug}`"><button class="button-primary">Learn More</button></router-link>
                </div>
              </template>
            </CardBriefProject>
          </div>
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .call-to-action {
    padding-bottom: 3rem;
  }
  .deployed, .repo {
    font-size: 2.5rem;
  }
  .repo {
    margin-left: 1.5rem;
  }
  .loading-indicator-wrapper {
  margin-bottom: 10rem;
  }
  .project-description {
    margin: 0rem;
    padding: 0rem 2rem 0rem 2rem;
  }
  .project-title {
    margin-top: 3rem;
    font-size: 2.5rem;
  }
  .screenshot-image {
      width: 333px;
      object-fit: contain;
  }
</style>
