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
    }
  };
</script>
