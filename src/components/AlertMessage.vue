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
  .default {
    background-color: #999999;
    color: #555555;
  }
  .error {
    background-color: #cc8888;
    color: #aa0000;
  }
  .info {
    background-color: #8888cc;
    color: #0000aa;
  }
  .success {
    background-color: #88cc88;
    color: #00aa00
  }
  .warning {
    color: #888800;
    background-color: #cccc88;
  }
</style>
