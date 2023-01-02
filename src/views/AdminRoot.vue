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
        <div class="one columns">
          &nbsp;
        </div>
        <div class="ten columns">
          <h1>
            Administration
          </h1>
          <AdminBreadCrumbs :breadcrumbs="breadcrumbs" :currentLocation="currentLocation" />
          <router-view></router-view>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
