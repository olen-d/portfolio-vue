<template>
  <div class="message">
    <MessageHeader v-if="messageHeader" v-bind:messageHeader="messageHeader">
    </MessageHeader>
    <MessageContent
      v-if="messageContent"
      v-bind:messageContent="messageContent"
    ></MessageContent>
  </div>
</template>

<script>
import MessageContent from "./MessageContent.vue";
import MessageHeader from "./MessageHeader.vue";

export default {
  components: {
    MessageContent,
    MessageHeader
  },

  props: {
    messageContent: {
      default: [],
      type: Array
    },

    messageHeader: {
      default: null,
      type: String
    }
  }
};
</script>
