<script setup>
  const emits = defineEmits(['cancelAction', 'confirmAction'])
  const props = defineProps({
    payload: {
      type: Object
    }, 
    title: {
      type: String
    },
    message: {
      type: String
    },
    confirm: {
      type: String
    },
    cancel: {
      type: String
    }
  })

  const cancelAction = () => {
    emits('cancelAction')
  }

  const confirmAction = () => {
    emits('confirmAction', props.payload)
  }
</script>

<template>
  <!-- HTML & CSS Based on Simple Modal for Skeleton.css by Paul McClean -->
  <div class="modal">
    <div class="modal-inner">
      <div class="modal-content">
        <div class="modal-close-icon">
          <i @click="cancelAction" class="fa fa-times delete"></i>
        </div>
        <div class="modal-content-inner">
          <h4>
            {{ title }}
          </h4>
          <p>
            {{ message }}
          </p>
        </div>
        <div class="modal-buttons">
          <button @click="confirmAction" class="button button-primary confirm-action">{{ confirm }}</button>
          <button @click="cancelAction" class="cancel-action">{{ cancel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>
