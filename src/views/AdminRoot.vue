<script setup>
  import { onMounted, ref, watch } from 'vue'
  import { useRoute } from 'vue-router'

  import { useAuthStore } from '@/store/auth.js'

  import AdminBreadCrumbs from '@/components/AdminBreadCrumbs.vue'

  const authStore = useAuthStore()
  const route = useRoute()

  const breadcrumbs = ref([])

  // Watch
  watch(() => route.matched, newMatched => {
    const newBreadcrumbs = route.matched.map(element => element.meta?.breadcrumb?.text)
    breadcrumbs.value = newBreadcrumbs
  })

  onMounted(() => {
    const initialBreadcrumbs = route.matched.map(element => element.meta?.breadcrumb?.text)
    breadcrumbs.value = initialBreadcrumbs
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
          <pre>
            <!-- {{ JSON.stringify(route, null, 3) }} -->
          </pre>
          <AdminBreadCrumbs :breadcrumbs="breadcrumbs" />
          <router-view></router-view>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
