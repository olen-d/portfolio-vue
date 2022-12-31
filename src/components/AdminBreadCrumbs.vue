<script setup>
defineProps({
  breadcrumbs: {
    type: Array,
    required: true
  }
})
</script>

<template>
  <div class="admin-bread-crumbs">
    {{ breadcrumbs.join(' / ') }}
  </div>
</template>