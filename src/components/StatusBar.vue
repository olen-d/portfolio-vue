<script setup>
  import { computed, ref } from 'vue'

  import { useStatusStore } from '@/store/status.js'

  const icons = ref({
    error: 'fas fa-bomb',
    info: 'fas fa-info-circle',
    success: 'fas fa-check-circle',
    warning: 'fas fa-exclamation-triangle'
  })

  const statusStore = useStatusStore()

  const statusUpdate = computed(() => {
    setTimeout(() => {
      statusStore.statusMessage = ''
      statusStore.statusCategory = ''
      }, 
      1000 * 5
    )
    return(statusStore.statusMessage)
  })
</script>

<template>
  <div class="status-bar-container">
    <div :class="statusStore.statusCategory">
      <i :class="icons[statusStore.statusCategory] "></i><span class="spacer-left">{{ statusUpdate }}</span>
    </div>
  </div>
</template>

<style scoped>
.spacer-left {
  margin-left: 1.5rem;
}

.status-bar-container {
  position: fixed;
  top: 6rem;
  padding: 0rem;
  width: 100%;
  z-index:8000;
}

.error, .info, .success, .warning {
  padding: 2rem;
}

.error {
  background-color: #ff9595;
  color: #aa0000;
}

.info {
  background-color: #bfbfff;
  color: #0000aa;
}
.success {
  background-color: #95ff95;
  color: #00aa00;
}

.warning {
  background-color: #ffff55;
  color: #c6c600;
}
</style>
