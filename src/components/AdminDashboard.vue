<script setup>
  import { useAuthStore } from '@/store/auth.js'

  const authStore = useAuthStore()
</script>

<template>
  <div class="admin-dashboard">
    <h2>
      Dashboard
    </h2>
    <p>Welcome {{ authStore.firstName }}!</p>
  </div>
</template>
