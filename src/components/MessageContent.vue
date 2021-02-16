<template>
  <div class="message-content" v-if="messageContent.length > 0">
    <p
      class="message-content-item"
      v-for="item in messageContent"
      v-bind:key="item.slice(0, 10)"
    >
      {{ item }}
    </p>
  </div>
</template>

<script>
export default {
  props: {
    messageContent: {
      type: Array
    }
  }
};
</script>
