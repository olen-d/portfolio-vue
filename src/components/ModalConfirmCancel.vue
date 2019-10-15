<template>
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
          <button class="button button-primary confirm-action">{{ confirm }}</button>
          <button @click="cancelAction" class="cancel-action">{{ cancel }}</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: ["title", "message", "confirm", "cancel"],

  methods: {
    cancelAction() {
      this.$emit("cancel-action");
    }
  }
}
</script>

<style scoped>

</style>