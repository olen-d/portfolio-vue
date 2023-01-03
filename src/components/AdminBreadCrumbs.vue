<script setup>
  const props = defineProps({
    breadcrumbs: {
      type: Array,
      required: true
    },
    currentLocation: {
      type: String,
      required: true
    }
  })
</script>

<template>
  <div v-for="{ path, text } in breadcrumbs" :key="path" class="admin-bread-crumbs" >
    <router-link :to="path">{{ text }}</router-link>
    <div class="admin-bread-crumbs-seperator">
      &raquo;
    </div>
  </div>
  <div class = "admin-current-location">
    {{ currentLocation }}
  </div>
</template>

<style scoped>
  .admin-bread-crumbs {
    display: inline-block;
    margin-top: 1rem;
    margin-right: 1rem;
    margin-bottom: 3rem;
    text-transform: capitalize;
  }
  .admin-bread-crumbs a:link,
  .admin-bread-crumbs a:visited {
    text-decoration: none;
  }
  .admin-current-location {
    display: inline-block;
    text-transform: capitalize;
  }
  .admin-bread-crumbs-seperator {
    display: inline-block;
    margin-left: 1rem;
  }
</style>