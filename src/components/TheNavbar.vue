<script setup>
  import NavbarFrontEnd from '@/components/NavbarFrontEnd.vue'
  import NavbarAdmin from '@/components/NavbarAdmin.vue'
  import UserMenu from '@/components/UserMenu.vue'

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
    <NavbarAdmin
      v-if="isAuthorized && showAdmin"
      :showStandard="showStandard"
      :showHamburger="showHamburger"
    />
    <NavbarFrontEnd
      v-else
      :showStandard="showStandard"
      :showHamburger="showHamburger"
    />
    <UserMenu
      v-if="isAuthorized"
    />
  </div>
</template>
