<template>
  <div class="container">
    <About />
    <ActivityGraphStrava />
  </div>
</template>

<script>
// @ is an alias to /src
import About from "@/components/About.vue";
import ActivityGraphStrava from "@/components/ActivityGraphStrava.vue";

export default {
  name: "about",
  components: {
    About,
    ActivityGraphStrava
  }
};
</script>
