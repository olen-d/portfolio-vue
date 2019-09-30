<template>
  <div class="signUp">
    <SignUp v-on="$listeners" />
  </div>
</template>

<script>
  // @ is an alias to /src
  import SignUp from "@/components/SignUp.vue";

  export default {
    name: "signUp",
    components: {
      SignUp
    },

    beforeRouteLeave (to, from, next) {
      this.$store.commit("setSignupPage", false);
      next();
    }
  };
</script>
