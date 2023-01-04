<script setup>
  import { onMounted, ref } from 'vue'

  import HeaderFrontEnd from '@/components/HeaderFrontEnd.vue'
  import LoadingIndicator from '@/components/LoadingIndicator.vue'
  import ProjectsFeatured from '@/components/ProjectsFeatured.vue'
  import SkillsTop from '@/components/SkillsTop.vue'

  const error = ref('')
  const loading = ref(false)
  const welcome = ref([])

  onMounted(async () => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/welcome`)
      if (response.ok) {
          const result = await response.json()
          loading.value = false

          const { data } = result
          welcome.value = data
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
  <div class="home-layout">
    <HeaderFrontEnd />
    <div class="container">
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <LoadingIndicator :loading="loading" :error="error" />
          <div v-if="welcome">
            <div v-for="{ _id, title, content } in welcome" :key="_id" class="welcome-items-list">
              <h1>
                {{ title }}
              </h1>
              <h5>
                {{ content }}
              </h5>
            </div>
          </div>
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
          <h1>
            Skills
          </h1>
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
          <SkillsTop :limit=3 />
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
          <h1>
            Featured Project
          </h1>
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
          <ProjectsFeatured :limit=1 />
        </div>
        <div class="one column">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
