<script setup>
  import { onMounted, ref } from 'vue'

  import { useRoute } from 'vue-router'

  import LoadingIndicator from "@/components/LoadingIndicator.vue"
  import ProjectDetail from "@/components/ProjectDetail.vue"

  const route = useRoute()
  const { params: { slug }, } = route

  const error = ref('')
  const loading = ref(true)
  const projectData = ref({})
  const projectSkills = ref([])
  const skills = ref([])

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/projects/${slug}`)
      if (response.ok) {
        const data = await response.json()
        loading.value = false
        projectData.value = data
      } else {
        throw new Error(`Network response was not ok. Unable to fetch project by slug ${slug}.`)
      }
    } catch (err) {
      error.value = err.toString()
      loading.value = false
    }

    await readSkills()
    projectSkills.value = skills.value.filter(element => projectData.value.data.skills.indexOf(element._id) !== -1)
  })

  const readSkills = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/skills/sort/name`)
      const { status } = response

      if (status === 200) {
        const data = await response.json()
        skills.value = data.skills.map(({ _id, name }) => { return { _id, name } })
      }
      // TODO: Finish the error handling to address all cases
      if (status === 404 && result.message) {
        error.value = 'No Skills Found'
        loading.value = false
      }
    } catch (error) {
      error.value = err.toString()
      loading.value = false
    }
  }
</script>
<template>
  <div class="project-layout">
    <div class="container">
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <div class="loading-indicator-wrapper">
            <LoadingIndicator :loading="loading" :error="error" />
          </div>
          <div v-if="!loading" class="project">
            <ProjectDetail :projectData="projectData" :projectSkills="projectSkills" />
          </div>
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
