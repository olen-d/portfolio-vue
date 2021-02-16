<template>
  <div class="message-header">
    <p>
      <b>{{ messageHeader }}</b>
    </p>
  </div>
</template>

<script>
export default {
  props: {
    messageHeader: {
      default: null,
      type: String
    }
  }
}
</script>
