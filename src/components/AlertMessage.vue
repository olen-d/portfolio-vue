<script setup>
  const props = defineProps({
    title: {
      type: String
    },
    type: {
      type: String,
      default: "default"
    }
  })
</script>

<template>
  <div class="alert-message">
    <div :class="type">
      <div class="alert-message-title" v-if="title">
        {{ title }}
      </div>
      <div class="alert-message-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .alert-message {
    padding-bottom: 5rem;
  }
  .alert-message-content {
    padding-top: 1rem
  }
  .alert-message-title {
    font-weight: 700;
    letter-spacing: 0.1rem;
  }
  .default, .error, .info, .success, .warning {
    padding: 2rem;
  }
  .default {
    background-color: #dfdfdf;
    color: #777;
  }
  .error {
    background-color: #ffdfdf;
    color: #dd0000;
  }
  .info {
    background-color: #dfdfff;
    color: #0000dd;
  }
  .success {
    background-color: #dfffdf;
    color: #00aa00
  }
  .warning {
    color: #cccc00;
    background-color: #ffffcc;
  }
</style>
