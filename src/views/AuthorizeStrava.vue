<template>
  <div class="authorize-strava">
    <AuthorizeStrava />
  </div>
</template>

<script>
// @ is an alias to /src
import AuthorizeStrava from "@/components/AuthorizeStrava.vue";

export default {
  name: "authorizeStrava",
  components: {
    AuthorizeStrava
  }
};
</script>
