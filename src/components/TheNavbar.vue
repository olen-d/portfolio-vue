<script setup>
  import TheNavbarAdmin from '@/components/TheNavbarAdmin.vue'
  import TheNavbarFrontEnd from '@/components/TheNavbarFrontEnd.vue'
  import TheUserMenu from '@/components/TheUserMenu.vue'

  import { computed, onMounted, onUnmounted, ref } from 'vue'

  import { useAuthStore } from '@/store/auth.js'

  const authStore = useAuthStore()

  const windowSize = ref({
    width: 0,
    height: 0
  })

  onMounted(() => {
    window.addEventListener('resize', handleResize())
    handleResize()
  })

  onUnmounted(() => {
    window.removeEventListener('resize', handleResize())
  })

  const handleResize = () => {
    windowSize.value.width = window.innerWidth
    windowSize.value.height = window.innerHeight
  }

  // Computed
  const isAuthorized = computed(() => {
    return authStore.authorized
  })

  const showAdmin = computed(() => {
    return authStore.administrator
  })

  const showFrontEnd = computed(() => {
    return !authStore.administrator
  })

  const showHamburger = computed(function() {
    return windowSize.value.width < 500
  })

  const showStandard = computed(function() {
    return windowSize.value.width >= 500
  })

</script>

<template>
  <div>
    <TheNavbarAdmin
      v-if="isAuthorized && showAdmin"
      :showStandard="showStandard"
      :showHamburger="showHamburger"
    />
    <TheNavbarFrontEnd
      v-else
      :showStandard="showStandard"
      :showHamburger="showHamburger"
    />
    <TheUserMenu
      v-if="isAuthorized"
    />
  </div>
</template>
