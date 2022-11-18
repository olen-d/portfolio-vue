<script setup>
  import { onMounted, ref } from 'vue'

  import HeaderFrontEnd from '@/components/HeaderFrontEnd.vue'
  import LoadingIndicator from '@/components/LoadingIndicator.vue'
  import SkillsTop from '@/components/SkillsTop.vue'
  import UserFullName from '@/components/UserFullName.vue'

  const error = ref('')
  const loading = ref(false)
  const welcome = ref([])

  onMounted(async() => {
    loading.value = true

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/welcome`)
      if (response.ok) {
          const data = await response.json()
          loading.value = false
          welcome.value = data.welcome[0]
        } else {
          throw new Error("Network response was not ok. Unable to fetch. ");
        }
    } catch (err) {
      error.value = err.toString()
      loading.value = false
    }
  })
</script>

<template>
  <div class="home-page">
    <HeaderFrontEnd />
    <div class="container">
      <div class="row">
        <div class="one column">
          &nbsp;
        </div>
        <div class="ten columns">
          <UserFullName username="olen.d" />
          <LoadingIndicator :loading="loading" :error="error" />
          <div v-if="welcome">
            <h5>
              {{ welcome.headline }}
            </h5>
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
    </div>
  </div>
</template>
