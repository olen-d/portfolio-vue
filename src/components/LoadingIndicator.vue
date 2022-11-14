<script setup>
  const props = defineProps({
    error: {
      type: String,
      default: 'Something went terribly wrong.'
    },
    loading: {
      type: Boolean,
      default: true
    }
  })
</script>

<template>
  <div class="loading-indicator">
    <div v-if="loading" class="loading">
      <i class="fa fa-spinner fa-spin large" />
    </div>
    <div v-if="error" class="error">
      {{ error }}
    </div>
  </div>
</template>

<style scoped>
.loading-indicator {
  width: 100%;
}

.loading {
  padding-top: 2rem;
  padding-bottom: 2rem;
  text-align: center;
}

.error {
  border: 1px solid #cc8888;
  border-radius: 1rem;
  padding: 2rem;
  background-color: #ffcccc;
  color: #cc0000;
}

.large {
  font-size: 4rem;
  color: #aaaaaa;
}
</style>
