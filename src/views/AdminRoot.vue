<script setup>
  import { computed, onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { useAuthStore } from '@/store/auth.js'

  import AdminBreadCrumbs from '@/components/AdminBreadCrumbs.vue'

  const authStore = useAuthStore()
  const route = useRoute()

  const breadcrumbs = ref([])
  const currentLocation = ref('')

  const updateBreadcrumbs = () => {
    const newBreadcrumbs = route.matched.map(element => {
      return {
        path: element.path,
        text: element.meta?.breadcrumb?.text
      }
    })

    const { text: newCurrentLocation } = newBreadcrumbs.pop()

    breadcrumbs.value = newBreadcrumbs
    currentLocation.value = newCurrentLocation
  }

  // Watch
  watch(() => route.matched, newMatched => {
    if (newMatched) {
      updateBreadcrumbs()
    }
  })

  onMounted(() => {
    updateBreadcrumbs()
  })
</script>

<template>
  <div class="container">
    <div class="admin-root">
      <div class="row">
        <div class="twelve columns">
          <h1>
            Developer Portfolio
          </h1>
          <AdminBreadCrumbs :breadcrumbs="breadcrumbs" :currentLocation="currentLocation" />
          <router-view></router-view>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .admin-root {
    margin-top: -14rem;
  }

  .admin-root h1 {
    margin-top: 2rem;
    font-size: 3rem;
    letter-spacing: 0.1rem;
  }
</style>
