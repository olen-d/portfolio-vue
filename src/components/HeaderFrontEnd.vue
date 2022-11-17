<script setup>
  import { onMounted, ref } from 'vue'

  const viteHostURL = ref(null)

  const returnImageSource = image => {
    return `${import.meta.env.VITE_ASSETS_HOST}${image}`
  }

  onMounted(() => {
   viteHostURL.value = import.meta.env.VITE_ASSETS_HOST
  })
</script>

<template>
  <div class="header-front-end" v-if="viteHostURL">
    <img :src="returnImageSource('/assets/images/OD_min_500x500.png')" width="200" height="200" />
  </div>
</template>

<style scoped>
  .header-front-end {
    margin-top:-20rem;
    margin-left:5rem;
  }
</style>
