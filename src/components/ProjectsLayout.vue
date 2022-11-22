<script setup>
  import { computed, onMounted, ref } from 'vue'

  import HeaderFrontEnd from '@/components/HeaderFrontEnd.vue'
  import LoadingIndicator from '@/components/LoadingIndicator.vue'

  const error = ref('')
  const loading = ref(false)
  const projects = ref([])
  const publicPath = ref(`${import.meta.env.VITE_ASSETS_HOST}`)

  // Computed
  const displayProjects = computed(() => {
    return projects.value.filter(project => project.show === 1)
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
            <div
              v-for="{
                _id,
                deployedLink,
                description,
                title,
                repoLink,
                screenshot
              } in sortedProjects"
              :key="_id"
              class="card u-pull-left"
            >
              <div class="card-title">
                <img
                  class="screenshot"
                  :src="`${publicPath}/assets/images/${screenshot}`"
                  :alt="`Screenshot of ${title}`"
                />
                <h2>
                  {{ title }}
                </h2>
                <p>
                  {{ description }}
                </p>
                <p><a :href="deployedLink">Visit the project</a>.</p>
                <p>
                  <a :href="repoLink">See the code on Github</a>
                </p>
              </div>
            </div>
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
.loading-indicator-wrapper {
  margin-bottom: 10rem;
}

.screenshot {
  width: 350px;
  height: auto;
}
</style>
