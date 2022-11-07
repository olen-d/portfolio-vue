<script setup>
  import { useAuthStore } from '@/store/auth.js'

  const authStore = useAuthStore()
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
          <router-view></router-view>
        </div>
        <div class="one columns">
          &nbsp;
        </div>
      </div>
    </div>
  </div>
</template>
