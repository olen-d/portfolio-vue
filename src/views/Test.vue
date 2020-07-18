<template>
  <div class="about">
    <ActivityGraphStrava />
  </div>
</template>

<script>
// @ is an alias to /src
import ActivityGraphStrava from "@/components/ActivityGraphStrava.vue";

export default {
  name: "about",
  components: {
    ActivityGraphStrava
  }
};
</script>
